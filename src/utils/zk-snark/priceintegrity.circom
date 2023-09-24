pragma circom 2.0.0;

include "./ethnewyork/circomlib/circuits/comparators.circom";

template priceintegrity() {
    signal input a[5];
    signal input price[5];
    signal input markpricetimes10;
    var interpolationcorrect;
    signal interpolate[5]; 
    var temp;
    signal sum;
    signal lessresult[5];
    signal greatresult[5];
    var result1[5];
    var result2[5];
    signal c;
    signal output total;
    
    for (var i = 0; i<5; i++){
        temp += a[i];
    }
    sum <== temp;


    component less1[5];
    for (var i = 0; i<5; i++){
        less1[i] = LessThan(32);
    }

    component great0[5];
    for (var i = 0; i<5; i++){
        great0[i] = GreaterEqThan(32);
    }

    

    

    for (var i = 0; i < 5; i++) {
        
        less1[i].in <== [a[i], 10]; 
        lessresult[i] <== less1[i].out;
    }
    result1[0] = lessresult[0]; 
    for (var i = 1; i < 5; i++) {
        result1[i] = result1[i-1] + lessresult[i]; 
    }  

    
    for (var i = 0; i < 5; i++) {
        great0[i].in <== [a[i],0]; 
        greatresult[i] <== great0[i].out;
    }
    result2[0] = greatresult[0]; 
    for (var i = 1; i < 5; i++) {
        result2[i] = result2[i-1] + greatresult[i];
    }

    interpolate[0] <== price[0]*a[0];
    for (var i = 1 ; i<5; i++){
        interpolate[i] <== interpolate[i-1] + price[i]*a[i];
    }
    //+ price[1]*a[1] + price[2]*a[2] + price[3]*a[3] + price[4]*a[4];
    //signal interpolate2 <== price[1]*a[1];
    //signal sdf <== interpolate+ interpolate2;

    interpolationcorrect = (interpolate[4]-markpricetimes10);
    
    //interpolationcorrect = (interpolate - markprice);

    c <== result1[4]+result2[4]; //c =10
    total <== c+sum+ interpolationcorrect; // 10 + 10 +0 = 20
    total === 20;


}   
component main = priceintegrity();
