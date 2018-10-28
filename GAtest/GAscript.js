//Google analytics test script
var id = 1;

function trackAddToCart() {
    //get data from page elements
    var productName = document.getElementById("productname").innerHTML;
    var productSize = document.getElementsByClassName("size")[0].innerHTML;
    var productId = id;
    console.log(productName);
    console.log(productSize);
    id++;
    
    //assemble a product field object of data
    ga("ec:addProduct", {
      "id": productId,
      "name": productName,
      "size": productSize,
      "quantity": 1
    });
    //determine the trigger to send it
    ga("ec:setAction", "add"); //specific enhanced ecommerce command to measure product add to cart
    ga("send", "event", "enhanced ecommerce", "button click", "addToCart");
    
}
