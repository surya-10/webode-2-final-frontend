import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Search() {
    let [currentPage, setCurrentPage] = useState(1);
    let [itemPerPage] = useState(13);
    let [allProd, setAllProd] = useState([]);
    let [show, setShow] = useState(false);
    let [searchProducts, setSearchProducts] = useState([]);
    let getProductNames = [];
    getProductNames.push("mobiles");
    getProductNames.push("ac");
    getProductNames.push("laptops");
    getProductNames.push("headphones");
    getProductNames.push("fridge");


    useEffect(() => {
        async function getAllProducts() {
            let productDetails = await fetch("https://webcode2-backend-0thr.onrender.com/all", {
                method: "GET",
                headers: {
                    "content-type": "application/json"
                }
            })
            let result = await productDetails.json();
            console.log(result);
            if (result.status == 200) {
                setTimeout(() => {
                    let sppiner = document.querySelector(".spin-div");
                    sppiner.style.display = "none";
                }, 500)

            }
            let { ac, fridge, headphones, laptop, mobiles } = { ...result };
            let finalList = [...ac, ...fridge, ...headphones, ...laptop, ...mobiles];
            console.log(finalList.length)
            setAllProd(finalList)
        }
        getAllProducts()
    }, [])

    allProd.map((prod) => {
        let tit = prod.title;
        getProductNames.push(tit.toLowerCase())
    })
    console.log(getProductNames);

    let indexOfLastItem = currentPage * itemPerPage;
    let indexOfFirstItem = indexOfLastItem - itemPerPage;
    let currentData = show ? searchProducts.slice(indexOfFirstItem, indexOfLastItem) : allProd.slice(indexOfFirstItem, indexOfLastItem);
    let totalPages = show ? Math.ceil(searchProducts.length / itemPerPage) : Math.ceil(allProd.length / itemPerPage);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    let navigate = useNavigate();

    function sendRequestToBackEnd(value) {
        loadData({ inputValue: value });
    }

    async function loadData(obj) {
        let sendRequest = await fetch("https://webcode2-backend-0thr.onrender.com/search", {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
                "content-type": "application/json"
            }
        })
        let returnedData = await sendRequest.json();
        console.log(returnedData.value);
        if(returnedData.status===200 && returnedData.msg==="ok"){
            setSearchProducts(returnedData.value);
            let element = document.querySelector(".err-msg");
            element.style.display = "none";
        }
        if(returnedData.status===200 && returnedData.msg==="success"){
            setSearchProducts(returnedData.value);
            let element = document.querySelector(".err-msg");
            element.style.display = "nobe";
        }
        if(returnedData.status==400 && returnedData.msg==="not found, search all to see all products"){
            let element = document.querySelector(".err-msg");
            element.style.display = "flex";
        }
       
        console.log(searchProducts);
        setShow(true);
    }
    const [inputValue, setInputValue] = useState('');
    const [matchingItems, setMatchingItems] = useState([]);


    const handleInputChange = (event) => {
        setMatchingItems([])
        const value = event.target.value;
        setInputValue(value);
        setMatchingItems([]);

        const filteredItems = getProductNames.filter((item) =>
            item.toLowerCase().includes(value.toLowerCase())
        );

        setMatchingItems(filteredItems.slice(0, 2))
    };

    const handleItemClick = (item) => {
        setInputValue(item);
        setMatchingItems([]);
    };
    return (
        <div className="search-div">

            <div className="inp">
                <h4 className="search-title">Search products</h4>
                <input
                    type="text"
                    placeholder="Search for items"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="form-control"
                />
                
            </div>
            
            <div className="ul">
                    <ul>
                        {matchingItems.map((item, index) => (
                            <li key={index} onClick={() => handleItemClick(item)}>{item}</li>
                        ))}
                    </ul>
                    
                </div>
                <div>
                <p className="text-danger err-msg text-center">Product not found. Search all to find all products</p>
                </div>
            <button className="btn bg-danger text-white" onClick={() => sendRequestToBackEnd(inputValue)}>Search</button>
            

            <div className="main-div">
                <div className="spin">
                    <div class="spinner-border mt-4 text-primary spin-div" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
                <div className="products d-flex justify-content-center align-items-center flex-row flex-wrap mt-4">
                    {currentData.map((prod, ind) => (
                        <div className="product" key={ind}>
                            <div className="details">
                                <img src={prod.image} />
                            </div>
                            <div className="title mt-4">
                                <p><b><em>{prod.title}</em></b></p>
                            </div>
                            <div className="rating">
                                <p><b>Rating: <span className="text-white bg-success p-2 rounded">{prod.rating}<i class="fa-regular fa-star ms-2"></i></span></b></p>
                            </div>
                            <div className="price">
                                <p>Price: <span className="fs-3">{prod.finalPrice}</span><span className="ms-3"><del>{prod.price}</del></span></p>
                            </div>
                            <div className="buy-btn">
                                <button className="btn cart">Add cart</button>
                                <button className="btn buy">Buy Now</button>
                            </div>
                            <i class="fa-regular fa-heart heart"></i>
                        </div>
                    ))}
                </div>
                <div className="pages d-flex justify-content-center mt-5">
                    <div className="pagination">
                        <button onClick={handlePreviousPage} className="btn text-dark bg-warning">Back</button>
                        <span className="mt-2 ms-2 me-2">Page {currentPage} of {totalPages}</span>
                        <button onClick={handleNextPage} className="btn text-dark bg-warning">Next</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Search;