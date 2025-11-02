export default function NumberEnemy({ id, value, x, y, shoot }) {
  return (
    <div
      onClick={() => shoot(id, value, x, y)}
      className="absolute flex items-center justify-center text-xl font-bold 
                 bg-purple-600 hover:bg-purple-400 transition rounded-full border border-purple-300 cursor-pointer shadow-lg"
      style={{
        width: "60px",
        height: "60px",
        left: `${x}px`,
        top: `${y}px`,
        userSelect: "none",
      }}
    >
      {value}
    </div>
  );
}
