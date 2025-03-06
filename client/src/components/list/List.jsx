import "./list.scss";
import Card from "../card/Card";

function List({ posts, onDelete, onSave }) {
  return (
    <div className="list">
      {posts.map((item) => (
        <Card key={item.id} item={item} onDelete={onDelete} onSave={onSave} />
      ))}
    </div>
  );
}

export default List;
