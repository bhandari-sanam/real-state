import { Link, useLoaderData } from "react-router-dom";
import "./agentPage.scss";

function AgentPage() {
  const agents = useLoaderData();

  return (
    <div className="agentPage">
      <h1>Agents</h1>
      <div className="agentList">
        {agents.map((agent) => (
          <Link to={`/agents/${agent.id}`} key={agent.id} className="agentCard">
            <img src={agent.avatar || "/noavatar.jpg"} alt={agent.username} />
            <h2>{agent.username}</h2>
            <p>{agent.email}</p>
            <p>{agent.phone}</p>
            <p>{agent.address}</p>
            <p>{agent.verified_by}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AgentPage;
