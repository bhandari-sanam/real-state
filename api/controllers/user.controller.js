import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";


// Get all agents
export const getAgents = async (req, res) => {
  try {
    const agents = await prisma.user.findMany({
      where: { userType: "Agent" },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
      },
    });

    res.status(200).json(agents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get agents" });
  }
};

// Get all posts created by an agent
export const getAgentPosts = async (req, res) => {
  try {
    const { agentId } = req.params;

    // Check if the agent exists
    const agent = await prisma.user.findUnique({
      where: { id: agentId, userType: "Agent" },
      select: { id: true, username: true, email: true, avatar: true },
    });

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Fetch all posts created by the agent
    const posts = await prisma.post.findMany({
      where: { userId: agentId },
      select: {
        id: true,
        title: true,
        price: true,
        images: true,
        address: true,
        city: true,
        bedroom: true,
        bathroom: true,
        createdAt: true,
      },
    });

    res.status(200).json({ agent, posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch agent's posts" });
  }
};

export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get user!" });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { password, avatar, ...inputs } = req.body;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });
  }

  let updatedPassword = null;
  try {
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...inputs,
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatar && { avatar }),
      },
    });

    const { password: userPassword, ...rest } = updatedUser;

    res.status(200).json(rest);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update users!" });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });
  }

  try {
    await prisma.user.delete({
      where: { id },
    });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete users!" });
  }
};

export const savePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;

  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId,
        },
      },
    });

    if (savedPost) {
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });
      res.status(200).json({ message: "Post removed from saved list" });
    } else {
      await prisma.savedPost.create({
        data: {
          userId: tokenUserId,
          postId,
        },
      });
      res.status(200).json({ message: "Post saved" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete users!" });
  }
};

export const profilePosts = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const userPosts = await prisma.post.findMany({
      where: { userId: tokenUserId },
    });
    const saved = await prisma.savedPost.findMany({
      where: { userId: tokenUserId },
      include: {
        post: true,
      },
    });

    const savedPosts = saved.map((item) => item.post);
    res.status(200).json({ userPosts, savedPosts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};

export const getUserWithPosts = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
      },
    });

    const posts = await prisma.post.findMany({
      where: { userId: id },
      include: {
        postDetail: true,
        user: true,
      },
    });

    res.status(200).json({ user, posts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get user and posts" });
  }
};
