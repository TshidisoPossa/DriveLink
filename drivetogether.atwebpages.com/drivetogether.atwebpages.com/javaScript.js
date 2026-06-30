function selectDates(){

    const pickup = document.getElementById("pickup").value;
    const returnDate = document.getElementById("return").value;

    if(pickup === "" || returnDate === ""){
        alert("Please select both pickup and return dates.");
        return;
    }

    alert(
        "Booking Request Submitted!\n\n" +
        "Pickup Date: " + pickup +
        "\nReturn Date: " + returnDate
    );
}