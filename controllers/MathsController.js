const path = require('path');
const fs = require('fs');
const { parse } = require('path');

module.exports =
    class MathsController extends require("./Controller"){
        constructor(HttpContext)
        {
            super(HttpContext);
            this.params = HttpContext.path.params;
        }

        checkParamCount(nbParams)
        {
            if(Object.keys(this.params).length > nbParams)
            {
                this.HttpContext.path.params.error = "too many parameters";
               return this.HttpContext.response.JSON(this.HttpContext.path.params);
            }
            return true;
        }
        checkParamDefined()
        {
            if(this.params.x == undefined && this.params.y != undefined)
            {
                this.HttpContext.path.params.value = null;
                return this.params.error = "x is not defined correctly";
            }
            else if(this.params.y == undefined && this.params.x != undefined)
            {
                this.HttpContext.path.params.value = null;
                return this.params.error = "y is not defined correctly";
            }
            return true;
        }
        get(){
            if(this.HttpContext.path.queryString == '?')
            {
                //Send help page
                let helpPagePath = path.join(process.cwd(), "wwwroot/helpPages/mathsServiceHelp.html");
                let content = fs.readFileSync(helpPagePath);
                this.HttpContext.response.content("text/html", content);
            }
            else{

                switch(this.HttpContext.path.params.op)
                {
                   
                    case ' ':
                        if(this.checkParamCount(3) && this.checkParamDefined())
                        {
                            this.HttpContext.path.params.op = '+';
                            this.HttpContext.path.params.value = parseInt(this.HttpContext.path.params.x) + parseInt(this.HttpContext.path.params.y);
                            this.HttpContext.response.JSON(this.HttpContext.path.params);
                            break;
                        }
                            break;
                    
                    case '-':
                        this.HttpContext.path.params.value = parseInt(this.HttpContext.path.params.x) - parseInt(this.HttpContext.path.params.y);
                        this.HttpContext.response.JSON(this.HttpContext.path.params);
                        break;
                    case '*':
                        if(isNaN(this.HttpContext.path.params.x))
                        {
                            this.HttpContext.path.params.error= "x parameter is not a number";
                            this.HttpContext.response.JSON(this.HttpContext.path.params);
                            break;
                        }
                        else if(isNaN(this.HttpContext.path.params.y))
                        {
                            this.HttpContext.path.params.error= "y parameter is not a number";
                            this.HttpContext.response.JSON(this.HttpContext.path.params);
                            break;
                        }
                        else{
                            this.HttpContext.path.params.value = parseInt(this.HttpContext.path.params.x) * parseInt(this.HttpContext.path.params.y);
                            this.HttpContext.response.JSON(this.HttpContext.path.params);
                            break;
                        }
                        
                    
                    case '/':
                        if(parseInt(this.HttpContext.path.params.x) == 0 || parseInt(this.HttpContext.path.params.y) == 0)
                        {
                            this.HttpContext.path.params.error = "Cannot divide by 0";
                            this.HttpContext.path.params.value = null;
                            this.HttpContext.response.JSON(this.HttpContext.path.params);
                            break;
                        }
                        else{
                            this.HttpContext.path.params.value = parseInt(this.HttpContext.path.params.x) / parseInt(this.HttpContext.path.params.y);
                            this.HttpContext.response.JSON(this.HttpContext.path.params);
                            break;
                        }
                        

                    case '%':
                        if(parseInt(this.HttpContext.path.params.x) == 0 || parseInt(this.HttpContext.path.params.y) == 0)
                        {
                            this.HttpContext.path.params.error = "Cannot do modulo by 0";
                            this.HttpContext.path.params.value = null;
                            this.HttpContext.response.JSON(this.HttpContext.path.params);
                            break;
                        }
                        else{
                            this.HttpContext.path.params.value = parseInt(this.HttpContext.path.params.x) % parseInt(this.HttpContext.path.params.y);
                            this.HttpContext.response.JSON(this.HttpContext.path.params);
                            break;
                        }
                        
                    case '!':
                        if(this.checkParamCount(2))
                        {
                            this.HttpContext.path.params.value = factorial(parseInt(this.HttpContext.path.params.n));
                            this.HttpContext.response.JSON(this.HttpContext.path.params);
                            break;
                        }
                        break;
                           
                    case 'p':
                        this.HttpContext.path.params.value = isPrime(parseInt(this.HttpContext.path.params.n));
                        this.HttpContext.response.JSON(this.HttpContext.path.params);
                        break;
                    
                    case 'np':
                        this.HttpContext.path.params.value = findPrime(parseInt(this.HttpContext.path.params.n));
                        this.HttpContext.response.JSON(this.HttpContext.path.params);
                        break;


                    default:
                        this.HttpContext.path.params.error ="Missing parameter op";
                        this.HttpContext.response.JSON(this.HttpContext.path.params);
                }
            }

            function factorial(n){
                if(n===0||n===1){
                  return 1;
                }
                return n*factorial(n-1);
            }
            function isPrime(value) {
                for(var i = 2; i < value; i++) {
                    if(value % i === 0) {
                        return false;
                    }
                }
                return value > 1;
            }
            function findPrime(n){
                let primeNumer = 0;
                for ( let i=0; i < n; i++){
                    primeNumer++;
                    while (!isPrime(primeNumer)){
                        primeNumer++;
                    }
                }
                return primeNumer;
            }
        }
    }