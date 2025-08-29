import React, { useState, useEffect } from "react";
import { Spinner, Card, Row, Col, Alert, Button, Modal } from "react-bootstrap";

export default function RecipeList({ ingredient, timeFilter, mood, showFavorites }) {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );
  const [speaking, setSpeaking] = useState(false);

  // Fetch recipes
  useEffect(() => {
    if (showFavorites) {
      setMeals(favorites);
      setLoading(false);
      return;
    }

    let url = "";
    if (mood) {
      url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${mood}`;
    } else {
      url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`;
    }

    if (!ingredient && !mood) return;

    setLoading(true);
    setError("");

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.meals) {
          Promise.all(
            data.meals.slice(0, 12).map((m) =>
              fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${m.idMeal}`)
                .then((res) => res.json())
                .then((d) => d.meals[0])
            )
          ).then((fullMeals) => {
            setMeals(fullMeals);
            setLoading(false);
          });
        } else {
          setMeals([]);
          setError("No recipes found.");
          setLoading(false);
        }
      })
      .catch(() => {
        setError("Something went wrong. Try again.");
        setLoading(false);
      });
  }, [favorites, ingredient, mood, showFavorites]);

  // Save favorites
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Estimate cooking time
  const getCookingTime = (instructions) => {
    if (!instructions) return 0;
    const len = instructions.length;
    if (len < 200) return 5;
    if (len < 500) return 15;
    if (len < 1000) return 30;
    return 60;
  };

  // Time filter
  const filterByTime = (meal) => {
    const time = getCookingTime(meal.strInstructions);
    if (timeFilter === "superquick") return time <= 5;
    if (timeFilter === "quick") return time <= 15;
    if (timeFilter === "normal") return time <= 30;
    if (timeFilter === "long") return time >= 60;
    return true;
  };

  // Voice
  const speakInstructions = (text) => {
    if (!window.speechSynthesis) {
      alert("Speech not supported in your browser.");
      return;
    }

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Favorites
  const toggleFavorite = (meal) => {
    const exists = favorites.find((f) => f.idMeal === meal.idMeal);
    if (exists) {
      setFavorites(favorites.filter((f) => f.idMeal !== meal.idMeal));
    } else {
      setFavorites([...favorites, meal]);
    }
  };

  const isFavorite = (idMeal) => {
    return favorites.some((f) => f.idMeal === idMeal);
  };

  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" variant="primary" />
        <p>Loading recipes...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger" className="text-center">{error}</Alert>;
  }

  return (
    <>
      <Row>
        {meals.filter(filterByTime).map((meal) => (
          <Col md={4} lg={3} className="mb-4" key={meal.idMeal}>
            <Card className="h-100 shadow-sm card-hover">
              <Card.Img
                variant="top"
                src={meal.strMealThumb}
                alt={meal.strMeal}
              />
              <Card.Body>
                <Card.Title>{meal.strMeal}</Card.Title>
                <p className="text-muted">
                  ⏱ {getCookingTime(meal.strInstructions)} min
                </p>
                <div className="d-flex justify-content-between">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setSelectedMeal(meal)}
                  >
                    View
                  </Button>
                  <Button
                    variant={isFavorite(meal.idMeal) ? "primary" : "outline-primary"}
                    size="sm"
                    onClick={() => toggleFavorite(meal)}
                  >
                    {isFavorite(meal.idMeal) ? "❤️ Saved" : "🤍 Save"}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {selectedMeal && (
        <Modal
          show={true}
          onHide={() => setSelectedMeal(null)}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>{selectedMeal.strMeal}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img
              src={selectedMeal.strMealThumb}
              alt={selectedMeal.strMeal}
              className="img-fluid rounded mb-3"
            />

            <h6 className="fw-bold">Category:</h6>
            <p>
              {selectedMeal.strCategory} – {selectedMeal.strArea}
            </p>

            <h6 className="fw-bold">Estimated Cooking Time:</h6>
            <p>⏱ {getCookingTime(selectedMeal.strInstructions)} minutes</p>

            <h6 className="fw-bold">Instructions:</h6>
            <p style={{ whiteSpace: "pre-line" }}>
              {selectedMeal.strInstructions}
            </p>
            <Button
              variant={speaking ? "danger" : "outline-success"}
              className="me-2"
              onClick={() => speakInstructions(selectedMeal.strInstructions)}
            >
              {speaking ? "⏹ Stop" : "🔊 Listen"}
            </Button>

            <Button
              variant="outline-primary"
              onClick={() => {
                navigator.clipboard.writeText(
                  `https://www.themealdb.com/meal/${selectedMeal.idMeal}`
                );
                alert("Recipe link copied!");
              }}
            >
              📤 Share
            </Button>

            <h6 className="fw-bold mt-3">Ingredients:</h6>
            <ul className="ingredients-list list-unstyled">
              {Array.from({ length: 20 }).map((_, i) => {
                const ing = selectedMeal[`strIngredient${i + 1}`];
                const measure = selectedMeal[`strMeasure${i + 1}`];
                return ing ? (
                  <li key={i}>
                    {ing} – {measure}
                  </li>
                ) : null;
              })}
            </ul>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}
