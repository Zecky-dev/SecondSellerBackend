// UserController fonksiyonları eklenecek

const register = async (req, res) => {
    const { password } = req.body;
    const saltRounds = 10;
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const userInfo = { ...req.body, password: hashedPassword };
      const existingUser = await User.findOne({ emailAddress: userInfo.email });
      if (!existingUser) {
        const createdUser = await User.create(userInfo);
        const token = jwt.sign(
          { userId: createdUser._id },
          process.env.JWT_SECRET_TOKEN,
          { expiresIn: "24h" }
        );
        return res.status(201).json({
          status: "success",
          message: "User creation successful!",
          token,
        });
      } else {
        return res.status(409).json({
          status: "error",
          message: "User already exist",
        });
      }
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err.response.data,
        error: err.response.data,
      });
    }
  };

  const getUser = async (req, res) => {
    try {
      const userID = req.params.id;
      const user = await User.findById(userID);
      
      // Eğer user null ise, 404 Not Found yanıtı döndür
      if (!user) {
        return res.status(404).json({
          status: "Error",
          message: "User not found",
        });
      }
      
      return res.status(200).json({
        status: "success",
        message: "User fetched successfully!",
        data: user,
      });
    } catch (err) {
      return res.status(500).json({
        status: "Error",
        message: "Error while fetching the user",
        error: err.message,
      });
    }
  };





  module.exports = {
    register,
    getUser
  }
