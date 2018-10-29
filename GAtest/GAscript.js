//Google analytics test script
var id = 1;

function trackAddToCart() {
    //get data from page elements
    var productName = document.getElementById("productname").innerHTML;
    var productSize = document.getElementsByClassName("size")[0].innerHTML;
    var productId = id;
    var productPrice = document.getElementsByClassName("price")[0].innerHTML.slice(document.getElementsByClassName("price")[0].innerHTML.indexOf("£"));
    
    //assemble a product field object of data
    ga("ec:addProduct", {
      "id": productId,
      "name": productName,
      "size": productSize,
      "price": productPrice,
      "quantity": 1
    });
    //determine the trigger to send it
    ga("ec:setAction", "add"); //specific enhanced ecommerce command to measure product add to cart
    ga("send", "event", "enhanced ecommerce", "button click", "addToCart");
    
}
