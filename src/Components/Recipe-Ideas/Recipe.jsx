import React, { useState } from "react";
import RecipeList from "./RecipeList";
import { Button, Dropdown } from "react-bootstrap";

function Recipe() {
  const [ingredient, setIngredient] = useState("chicken");
  const [search, setSearch] = useState("chicken");
  const [timeFilter, setTimeFilter] = useState("");
  const [mood, setMood] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(ingredient);
    setShowFavorites(false);
  };

  return (
    <div className="container my-4 text-center">
      {/* Heading */}
      <h2 className="text-dark fw-bold mb-3 fade-in-up">
        🍲 Smart Recipe Ideas
      </h2>
      <p
        className="text-muted fade-in-up"
        style={{ animationDelay: "0.3s" }}
      >
        Quick recipes for your busy lifestyle
      </p>

      {/* Search Bar */}
      <form
        className="d-flex justify-content-center mb-3 fade-in-up"
        style={{ animationDelay: "0.6s" }}
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="form-control w-50 me-2"
          placeholder="Enter ingredient (e.g., egg, rice)"
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
        />
        <button className="btn btn-primary bounce">Search</button>
      </form>

      {/* Dropdowns */}
      <div className="mb-4 d-flex justify-content-center gap-3 flex-wrap">
        {/* Time Dropdown */}
        <Dropdown onSelect={(val) => setTimeFilter(val)}>
          <Dropdown.Toggle variant="outline-primary">
            {timeFilter ? `⏱ ${timeFilter}` : "⏱ Select Time"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="superquick">⚡ Super Quick (5 min)</Dropdown.Item>
            <Dropdown.Item eventKey="quick">⏱ Quick (15 min)</Dropdown.Item>
            <Dropdown.Item eventKey="normal">⏱ Normal (30 min)</Dropdown.Item>
            <Dropdown.Item eventKey="long">⏳ Long (1 hr+)</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* Mood Dropdown */}
        <Dropdown onSelect={(val) => setMood(val)}>
          <Dropdown.Toggle variant="outline-primary">
            {mood ? `😋 ${mood}` : "😋 Select Mood"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="Vegetarian">🥦 Vegetarian</Dropdown.Item>
            <Dropdown.Item eventKey="Dessert">🍰 Sweet</Dropdown.Item>
            <Dropdown.Item eventKey="Seafood">🐟 Seafood</Dropdown.Item>
            <Dropdown.Item eventKey="Beef">🥩 Beef</Dropdown.Item>
            <Dropdown.Item eventKey="Chicken">🍗 Chicken</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* Favorites Toggle */}
        <Button
          variant={showFavorites ? "primary" : "outline-primary"}
          onClick={() => setShowFavorites(!showFavorites)}
        >
          ❤️ My Favorites
        </Button>
      </div>

      {/* Recipe List */}
      <RecipeList
        ingredient={search}
        timeFilter={timeFilter}
        mood={mood}
        showFavorites={showFavorites}
      />
    </div>
  );
}

export default Recipe;
