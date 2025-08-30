// 6. DELETE ADDRESS API - app/api/delete-address/[id]/route.js
import { NextResponse } from 'next/server';
import { executeQuery } from '../../../../lib/db';
import { cookies } from 'next/headers';

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

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

    // Check if address exists and belongs to user
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

    const wasDefault = existingAddress[0].is_default;

    // Delete address
    await executeQuery(
      'DELETE FROM addresses WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    // If deleted address was default, make another address default
    if (wasDefault) {
      const remainingAddresses = await executeQuery(
        'SELECT id FROM addresses WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
        [userId]
      );

      if (remainingAddresses.length > 0) {
        await executeQuery(
          'UPDATE addresses SET is_default = TRUE WHERE id = ?',
          [remainingAddresses[0].id]
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully'
    });

  } catch (error) {
    console.error('Delete address error:', error);
    return NextResponse.json(
      { error: 'Failed to delete address' },
      { status: 500 }
    );
  }
}