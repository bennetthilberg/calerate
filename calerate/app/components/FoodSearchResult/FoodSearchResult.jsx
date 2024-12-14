import AddServing from "../AddServing/AddServing";
import styles from "./FoodSearchResult.module.scss";

export default function FoodSearchResult({ food }) {
    /*
    for SR Legacy, there's no servingSize/servingSizeUnit, but
    the foodNutrients array has an object with nutrientName "Energy"
    and the value is calories per 100g
    -same with Survey (FNDDS) 
    -same with Foundation
    -branded does too. they also have servingSize and stuff but for
      the sake of simplicity we can calculate same way as the others
    ensure nutrient.unitName is "KCAL" since some foods have kj too
    */
    function getCaloriesPer100g() {
        const energy = food?.foodNutrients.find(nutrient => nutrient.nutrientName === "Energy" && nutrient.unitName === "KCAL");
        const energyValue = energy?.value; // an amount of calories in some amount of the food
        if (!energyValue) {
            console.log('no energy value')
            return null;
        }
        // todo check if there is a serving size and it's not 100g, adjust or just dont display it
        return energyValue;
    }
    const calsPer100g = getCaloriesPer100g();
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
    function getFoodTitle() {
        if (typeof food?.description !== 'string' || food.description.trim() === '') {
            return null;
        }
        if(food.description !== food.description.toUpperCase()) {
            return food.description;
            // if it's already in a correct case, don't change it
        }
        const words = food.description.split(" ");
        const titleCased = words.map(word => {
            if (acronyms.includes(word.toUpperCase())) {
                return word.toUpperCase();
            }
            if (smallWords.includes(word.toLowerCase())) {
                return word.toLowerCase();
            }
            if (!word[0]) return '';
            return word[0].toUpperCase() + word.slice(1).toLowerCase();
        });
        return titleCased.join(' ');
    }
    const foodTitle = getFoodTitle();

    return (
        <div className={styles.foodSearchResult}>
            <h2>{foodTitle}</h2>
            {
                /* 
            <p>
                <span className="bold">{Math.round(calsPer100g)}</span> calories per 100g
            </p>
                */
            }
            <p className={styles.source}>
                from: {food.dataType}
            </p>
            <AddServing food={
                {
                    ...food,
                    calsPer100g,
                    foodTitle
                }
            } />
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