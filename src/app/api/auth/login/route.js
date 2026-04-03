import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req) {
  try {
    await connectDB();
    
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || user.password !== password) {
      return Response.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last login
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    // Return user data (without password)
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      initials: user.initials,
      // Include role-specific data
      ...(user.role === 'patient' && {
        age: user.age,
        gender: user.gender,
        bloodGroup: user.bloodGroup,
        city: user.city,
        address: user.address,
        emergencyContact: user.emergencyContact,
        medicalHistory: user.medicalHistory,
        allergies: user.allergies,
        pets: user.pets,
        walletBalance: user.walletBalance,
      }),
      ...(user.role === 'doctor' && {
        specialization: user.specialization,
        qualification: user.qualification,
        experience: user.experience,
        hospital: user.hospital,
        type: user.type,
        rating: user.rating,
        totalReviews: user.totalReviews,
        consultationFee: user.consultationFee,
      }),
    };

    return Response.json(
      { success: true, user: userData },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { success: false, error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}
