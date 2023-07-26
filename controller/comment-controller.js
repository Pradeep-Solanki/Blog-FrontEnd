import Comment from "../model/comment.js";

export const newComment = async (request, response) => {
  try {
    const comment = await new Comment(request.body);
    comment.save();

    response.status(200).json("Comment saved successfully");
  } catch (error) {
    response.status(500).json(error);
  }
};

export const getComments = async (request, response) => {
  try {
    const comments = await Comment.find({ postId: request.params.id });

    response.status(200).json(comments);
  } catch (error) {
    response.status(500).json(error);
  }
};

// export const deleteComment = async (request, response) => {
//   try {
//     const comment = await Comment.findById(request.params.id);
//     await comment.delete();

//     response.status(200).json("comment deleted successfully");
//   } catch (error) {
//     response.status(500).json(error);
//   }
// };
export const deleteComment = async (req, res) => {
  // const id = req.params.id;
  try {
    // const data = await Post.findByIdAndDelete(id);
    const post = await Comment.findByIdAndDelete(req.params.id);
    // console.log(post, req.params.id);
    // post.delete();
    res.status(201).send("post deleted successfully");
  } catch (error) {
    console.error("Error while deleting ToDo:", error);
    res.status(500).send("Error while deleting ToDo.");
  }
};
