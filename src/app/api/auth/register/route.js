import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req) {
  try {
    await connectDB();
    
    const userData = await req.json();
    const { name, email, password, role } = userData;

    if (!name || !email || !password || !role) {
      return Response.json(
        { success: false, error: 'Name, email, password, and role are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return Response.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = new User({
      id: `${role.toUpperCase()}_${Date.now()}`,
      ...userData,
      email: email.toLowerCase(),
      initials: name.split(' ').map(n => n[0]).join(''),
      joinDate: new Date(),
    });

    await newUser.save();

    const returnUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      avatar: newUser.avatar,
      initials: newUser.initials,
    };

    return Response.json(
      { success: true, user: returnUser },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return Response.json(
      { success: false, error: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}
