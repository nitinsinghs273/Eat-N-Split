import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);

  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend((showAddFriend) => !showAddFriend);
  }

  function handleClick() {
    setShowAddFriend((show) => !show);
  }

  function handleSelectedFriend(friend) {
    setSelectedFriend((curr) => (curr?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    console.log(value);

    setFriends((friends) =>
      friends.map((friend) =>
        selectedFriend.id === friend?.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onhandleSelect={handleSelectedFriend}
        />

        {showAddFriend && <FormAddFriend onAddFriends={handleAddFriend} />}

        <Button onclick={handleClick}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onhandleSelect, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <FriendItems
          friend={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
          onhandleSelect={onhandleSelect}
        />
      ))}
    </ul>
  );
}

function FriendItems({ friend, onhandleSelect, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name}></img>
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {friend.balance}$
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onclick={() => onhandleSelect(friend)}>
        {selectedFriend?.id === friend.id ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onclick }) {
  return (
    <button className="button" onClick={onclick}>
      {children}
    </button>
  );
}

function FormAddFriend({ onAddFriends }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriends(newFriend);

    console.log(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍💼Friend name</label>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🌅Image URL</label>
      <input
        type="text"
        placeholder="URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByuser, setPaidByUser] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmitForm(e) {
    e.preventDefault();

    if (!bill || !paidByuser) return;

    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByuser);
  }
  const paidByFriend = bill > 0 ? bill - paidByuser : "";
  return (
    <form className="form-split-bill" onSubmit={handleSubmitForm}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>🕴️Your Expense</label>
      <input
        type="text"
        value={paidByuser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByuser : Number(e.target.value)
          )
        }
      />
      <label>🧑‍🤝‍🧑{selectedFriend.name}'s Expense</label>
      <input type="text" value={paidByFriend} disabled />
      <label>🤑 who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
