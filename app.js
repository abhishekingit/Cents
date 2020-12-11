//we are going to use modules in this project to separate code
//this is data encapsulation by using concept of IIFEs and closures
//in these modules the variables and functions are going to be private and not accessible by the outer scope
//for module it returns an object which contains methods which are accessible to outer scope

//Budgetcontroller
var budgetController = (function(){
    //Expense and Income constructors
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
        
    };
    Expense.prototype.calcPercentage = function(totalIncome) {

        if(totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);

        } else {
            this.percentage = -1;

        }       

    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
        
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };


    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(curr){
            sum += curr.value;


        });
        data.totals[type] = sum;


    };


    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            

            // 1 2 3 4 5 next ID = 6
            //ID = last ID + 1]
            //create new ID
            if (data.allItems[type].length > 0) {

                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;

            } else {
                ID = 0;

            }
           
            
            //create newitem based on inc or exp
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);

            }
            //push the newitem into the data structure
            data.allItems[type].push(newItem);

            //return newitem
            return newItem;

            
        },
        deleteItem: function(type, id) {
            //id = 6
            //data.allItems[type][id]
            //[1 2 4 6 8]
            //index = 3
            //loop method map to make arrays of Ids

            var ids = data.allItems[type].map(function(current){
                return current.id;


            });
            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);

            }

        },



        calculateBudget: function() {
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

 
            //calculate the percentage of income that we spent
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);

            } else {
                data.percentage = -1;

            }
           

        },
        calculatePercentage: function() {
            /*
            a=10
            b=20
            c=40
            income = 100
            a = 20/100 = 20%

            */
        data.allItems.exp.forEach(function(curr){
            curr.calcPercentage(data.totals.inc);

           });

        },
        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(curr){
                return curr.getPercentage();

            });
            return allPerc;



        },



        getBudget:function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };

        },

        testing: function() {
            console.log(data);

        }
        
    }



})();

//these modules are separated and have no connection 
//UIcontroller
var uiController = (function(){
    var DOMstrings = {
        inputType: '.add__type',
        inputDes: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month',
        imageTop: '.top'
    };

    
    var bgPics = new Array('back1.jpg', 'back2.jpg', 'back3.jpg', 'back4.jpg', 'back5.jpg');
    var randomNum = Math.floor(Math.random() * bgPics.length);

    document.querySelector(DOMstrings.imageTop).style.background = `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(${bgPics[randomNum]})`;
    document.querySelector(DOMstrings.imageTop).style.backgroundSize = 'cover';
    document.querySelector(DOMstrings.imageTop).style.backgroundPosition = 'center';

    var formatNumber = function(num, type) {
        var numSplit, int, dec, type;
        /**
         + or - before number
         exactly 2 decimal points
         comma separating the thousands
         2310.4567 -> +2,310.46
         */

         num = Math.abs(num);
         num = num.toFixed(2);
         numSplit = num.split('.')
         int = numSplit[0];
         if(int.length > 3) {
            int = int.substr(0,int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 2310
         }
         dec =numSplit[1];

         

         return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;


    };
    var nodeListforEach = function(list, callback) {
        for(var i = 0;i<list.length;i++) {
            callback(list[i],i); 
        }


    };




    return {
        getInput: function() {
            return{
            type: document.querySelector(DOMstrings.inputType).value, //inc or exp
            description: document.querySelector(DOMstrings.inputDes).value,
            value: parseFloat(document.querySelector(DOMstrings.inputValue).value)

            };
                     

        },
        addListItem: function(obj, type) {
        var html;
        //create HTML string with placeholder text
        
        //income
        if (type === 'inc'){
            element = DOMstrings.incomeContainer;
            html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'  

        } else if (type === 'exp') { //expense
            element = DOMstrings.expenseContainer;


            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

        }      


        //Replace the place holder text with data
        newHtml = html.replace('%id%',obj.id);
        newHtml = newHtml.replace('%description%',obj.description);
        newHtml = newHtml.replace('%value%',formatNumber(obj.value, type));
        

        //INsert html into the dom
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);




        },
        deleteListItem: function(selectorId) {
            var el = document.getElementById(selectorId);
            el.parentNode.removeChild(el);


        },

        clearFields: function () {
           var fields;


           fields = document.querySelectorAll(DOMstrings.inputDes + ', ' + DOMstrings.inputValue);

           fieldsArr = Array.prototype.slice.call(fields);

           fieldsArr.forEach(function(current, index, array){
               current.value = "";


           });
           fieldsArr[0].focus();


        },

        displayBudget: function(obj) {
            obj.budget > 0 ? type = 'inc' : type = 'exp';


            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            if(obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';

            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '--';
            }



        },

        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            
            nodeListforEach(fields, function(current,index){
                if(percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';

                } else {
                    current.textContent = '---';

                }
                


            });



        },

        displayDate: function() {
            var now, months, monthNo, year;
            now = new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            monthNo = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[monthNo] + ' ' + year;
            


        },

        changedType: function() {
            var fields = document.querySelectorAll(DOMstrings.inputType + ',' + DOMstrings.inputDes + ',' + DOMstrings.inputValue);

            nodeListforEach(fields,function(curr){
                curr.classList.toggle('red-focus');


            });
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');



        },
     

        getDOMstrings: function() {
            return DOMstrings;
        }
    };
    
})();

//this module is for connecting the other module
//Global app controller 
var controller = (function(budgetCtrl,UICtrl){

    

    var setupEventListeners = function() {
    
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);

    document.addEventListener('keypress',function(event){
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }


        });

    document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
    
    document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changedType);

      
        
    };

    var updateBudget = function () {
        //1.calculate the budget
        budgetCtrl.calculateBudget()


        //2.return budget
        var budget = budgetCtrl.getBudget();


       //3.Display the budget on the UI
        console.log(budget);

        UICtrl.displayBudget(budget);




    };
    var updatePercentages = function() {
        //1. Calculate the percentages
        budgetCtrl.calculatePercentage();


        //2.read the percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();


        //3. Update the ui with the new percentages
        UICtrl.displayPercentages(percentages);





    };

    

    var ctrlAddItem = function() {
       var input, newItem;
        //to do list
       //1.get the input data
       input = UICtrl.getInput();

       if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
           
       //2.add item to the budget controller
       newItem = budgetCtrl.addItem(input.type, input.description, input.value);


       //3.add item to the UI
       UICtrl.addListItem(newItem, input.type);

       //4.Clear the fields
       UICtrl.clearFields();

       //5. Calculate and update budget
       updateBudget();

       //6. Calculate and update the percentages 
       updatePercentages();
       

       }     


    };


    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]); //originally this is a string 
            //1. delete the item from the budget data structure 
            budgetCtrl.deleteItem(type, ID);
            


            //2. delete  the item from the UI controller 
            UICtrl.deleteListItem(itemID);


            //3.Update and show the new budget 
            updateBudget();



        }      





    };

    return {
        init: function() {
            console.log('application has started');
            UICtrl.displayDate();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();

        }
    }

    
    
    

})(budgetController,uiController);


controller.init();
