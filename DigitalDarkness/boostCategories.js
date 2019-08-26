/*
*
* Mouse Pro
*
* Boost categories.js
*/

(function (BoostCategories) {

    BoostCategories.categories = [];
    BoostCategories.newCategory = function newCategory(categoryName, categoryLabel, icon) {
        BoostCategories.categories.push({ name: categoryName, label: categoryLabel, icon: icon, active: false });
    }

    BoostCategories.category = function category(categoryName) {
        return BoostCategories.categories.filter(c => c.name === categoryName)[0];
    }

    BoostCategories.getActiveCategory = function getActiveCategory() {
        return BoostCategories.categories.filter(c => c.active)[0];
    }
    
    BoostCategories.activate = function activate(category) {
        BoostCategories.categories.forEach(cat => {
            cat.active = false;
        });
        BoostCategories.category(category).active = true;
    }

    BoostCategories.newCategory('*', 'All', 'star');
    BoostCategories.newCategory('common', 'Common', 'align-justify');
    BoostCategories.newCategory('blood', 'Blood', 'tint red');
    BoostCategories.newCategory('digital', 'Digital', 'tv digital');

    BoostCategories.activate('*');

})(gameObjects.BoostCategories);