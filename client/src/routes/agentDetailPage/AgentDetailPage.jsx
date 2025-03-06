import { Link, useLoaderData } from "react-router-dom";
import "./agentDetailPage.scss";

function AgentDetailPage() {
  const { agent, posts } = useLoaderData();

  return (
    <div className="agentDetailPage">
      <div className="agentInfo">
        <img src={agent.avatar || "/noavatar.jpg"} alt={agent.username} />
        <h1>{agent.username}</h1>
        <p>{agent.phone}</p>
        <p>{agent.address}</p>
        <p>{agent.email}</p>
        <p>{agent.verified_by}</p>
      </div>
      <div className="agentPosts">
        <h2>Posts by {agent.username}</h2>
        <div className="postList">
          {posts.map((post) => (
            <Link to={`/${post.id}`} key={post.id} className="postCard">
              <div className="imageContainer">
                <img src={post.images[0]} alt={post.title} />
              </div>
              <div className="textContainer">
                <h3>{post.title}</h3>
                <p className="address">
                  <img src="/pin.png" alt="Location" />
                  <span>{post.address}</span>
                </p>
                <p className="price">$ {post.price}</p>
                <div className="features">
                  <div className="feature">
                    <img src="/bed.png" alt="Bedroom" />
                    <span>{post.bedroom} bedroom</span>
                  </div>
                  <div className="feature">
                    <img src="/bath.png" alt="Bathroom" />
                    <span>{post.bathroom} bathroom</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AgentDetailPage;
