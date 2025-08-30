import { NextResponse } from 'next/server';
import { executeQuery } from '../../../../lib/db';
import { cookies } from 'next/headers';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, phone, address, city, state, pincode, isDefault = false } = body;

    // Validation
    if (!name || !phone || !address || !city || !state || !pincode) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Get user ID from token
    const cookieStore = cookies();
    const userToken = cookieStore.get('userToken')?.value;
    const userId = getUserIdFromToken(userToken);

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if address belongs to user
    const existingAddress = await executeQuery(
      'SELECT * FROM addresses WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (existingAddress.length === 0) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      );
    }

    // If setting as default, update other addresses
    if (isDefault) {
      await executeQuery(
        'UPDATE addresses SET is_default = FALSE WHERE user_id = ?',
        [userId]
      );
    }

    // Update address
    const updateQuery = `
      UPDATE addresses 
      SET name = ?, phone = ?, address = ?, city = ?, state = ?, pincode = ?, is_default = ?, updated_at = NOW()
      WHERE id = ? AND user_id = ?
    `;

    await executeQuery(updateQuery, [
      name.trim(),
      phone.trim(),
      address.trim(),
      city.trim(),
      state.trim(),
      pincode.trim(),
      isDefault,
      id,
      userId
    ]);

    // Fetch updated address
    const updatedAddress = await executeQuery(
      'SELECT * FROM addresses WHERE id = ?',
      [id]
    );

    return NextResponse.json({
      success: true,
      message: 'Address updated successfully',
      address: updatedAddress[0]
    });

  } catch (error) {
    console.error('Update address error:', error);
    return NextResponse.json(
      { error: 'Failed to update address' },
      { status: 500 }
    );
  }
}