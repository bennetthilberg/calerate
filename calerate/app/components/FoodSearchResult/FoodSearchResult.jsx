import styles from "./FoodSearchResult.module.scss";

export default function FoodSearchResult({ food }) {
    function calculateCaloriesPer100g() {
        const energy = food.foodNutrients.find(nutrient => nutrient.nutrientName === "Energy" && nutrient.unitName === "KCAL");
        const servingSize = food.servingSize;
        const servingSizeUnit = food.servingSizeUnit; // almost always "g"
        const energyValue = energy.value; // an amount of calories in some amount of the food
        if (servingSizeUnit !== "g") {
            return null; // just wont display these. they are rare
        }
        const calsPer100g = (energyValue / servingSize) * 100;
        return calsPer100g;
    }
    const calsPer100g = calculateCaloriesPer100g();
    if (calsPer100g === null ||
        isNaN(calsPer100g) ||
        calsPer100g < 14 ||
        calsPer100g > 890
    ) {
        return null;
    }

    const acronyms = [ // convertToTitleCase will keep these capital
        'GMO', 'GF', 'HFCS', 'HF',
        "KFC", 'MSG', 'DNA', 'RNA',
        'USDA', 'BBQ'
    ]
    const smallWords = [
        'for', 'and', 'nor', 'but', 'or', 'yet', 'so', 'with',
        'at', 'by', 'from', 'in', 'into', 'of', 'off', 'on', 'onto',
    ]
    function getTitleCase() {
        const words = food.description.split(" ");
        const titleCased = words.map(word => {
            if (acronyms.includes(word.toUpperCase())) {
                return word.toUpperCase();
            }
            if (smallWords.includes(word.toLowerCase())) {
                return word.toLowerCase();
            }
            return word[0].toUpperCase() + word.slice(1).toLowerCase();
        });
        return titleCased.join(' ');
    }
    const titleCase = getTitleCase();

    return (
        <div className={styles.foodSearchResult}>
            <h2>{titleCase}</h2>
            <p>
                <span className="bold">{Math.round(calsPer100g)}</span> calories per 100g
            </p>
            <button>
                Add
            </button>
        </div>
    )
}
/* 
    foods have a foodNutrients array of objects. we want the element
    with the nutrientName of "Energy". the unitName should be "KCAL"
    the "value" key of the object is the number of calories.

    we also need food.servingSize and food.servingSizeUnit.
    for almost all of them, the servingSizeUnit is "g" (grams).
    we want to display the calories per 100g of the food,
    so some calculation is necessary
*/