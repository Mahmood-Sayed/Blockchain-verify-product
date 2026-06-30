// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ProductVerification {
    struct Product {
        uint256 id;
        string name;
        string serialNo;
        string manufacturer;
        uint256 timestamp;
        address registeredBy;
        bool exists;
    }

    mapping(uint256 => Product) private products;
    mapping(string => uint256) private serialToId;
    uint256 private productCount;

    event ProductRegistered(uint256 indexed id, string serialNo, address indexed registeredBy);
    event ProductVerified(uint256 indexed id, string serialNo, address indexed verifiedBy);

    modifier onlyNewSerial(string memory _serialNo) {
        require(serialToId[_serialNo] == 0, "Product with this serial already exists");
        _;
    }

    function registerProduct(
        string memory _name,
        string memory _serialNo,
        string memory _manufacturer
    ) public onlyNewSerial(_serialNo) returns (uint256) {
        productCount++;
        products[productCount] = Product({
            id: productCount,
            name: _name,
            serialNo: _serialNo,
            manufacturer: _manufacturer,
            timestamp: block.timestamp,
            registeredBy: msg.sender,
            exists: true
        });
        serialToId[_serialNo] = productCount;
        emit ProductRegistered(productCount, _serialNo, msg.sender);
        return productCount;
    }

    function verifyProduct(string memory _serialNo) public returns (bool, Product memory) {
        uint256 id = serialToId[_serialNo];
        if (id == 0) {
            Product memory empty;
            return (false, empty);
        }
        emit ProductVerified(id, _serialNo, msg.sender);
        return (true, products[id]);
    }

    function getProductById(uint256 _id) public view returns (Product memory) {
        require(products[_id].exists, "Product not found");
        return products[_id];
    }

    function getProductCount() public view returns (uint256) {
        return productCount;
    }
}
