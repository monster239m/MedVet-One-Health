import connectDB from '@/lib/db';
import User from '@/models/User';
import { MOCK_USERS } from '@/data/mockData';

export async function GET(req) {
  try {
    await connectDB();

    // Check if users already exist
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      return Response.json(
        { success: true, message: 'Database already seeded', count: existingUsers },
        { status: 200 }
      );
    }

    // Seed patients, doctors, and admins
    const allUsers = [
      ...MOCK_USERS.patients.map(u => ({ ...u, role: 'patient' })),
      ...MOCK_USERS.doctors.map(u => ({ ...u, role: 'doctor' })),
      ...MOCK_USERS.admins.map(u => ({ ...u, role: 'admin' })),
    ];

    const createdUsers = await User.insertMany(allUsers);

    return Response.json(
      { success: true, message: `Seeded ${createdUsers.length} users`, count: createdUsers.length },
      { status: 201 }
    );
  } catch (error) {
    console.error('Seed error:', error);
    return Response.json(
      { success: false, error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}
