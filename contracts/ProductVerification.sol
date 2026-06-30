// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ProductVerification {
    
    struct Product {
        uint256 id;
        string name;
        string serialNumber;
        string manufacturer;
        uint256 registeredAt;
        address registeredBy;
        bool exists;
        bool isAuthentic;
    }

    struct Company {
        string name;
        string email;
        address walletAddress;
        bool isRegistered;
        uint256 registeredAt;
    }

    // Mappings
    mapping(address => Company) public companies;
    mapping(string => Product) public products; // serialNumber => Product
    mapping(address => string[]) public companyProducts; // company => serialNumbers

    uint256 public productCount;
    uint256 public companyCount;

    // Events
    event CompanyRegistered(address indexed wallet, string name, uint256 timestamp);
    event ProductRegistered(string indexed serialNumber, string name, address indexed manufacturer, uint256 timestamp);
    event ProductVerified(string indexed serialNumber, bool isAuthentic, uint256 timestamp);

    // Modifiers
    modifier onlyRegisteredCompany() {
        require(companies[msg.sender].isRegistered, "Company not registered");
        _;
    }

    modifier productExists(string memory serialNumber) {
        require(products[serialNumber].exists, "Product does not exist");
        _;
    }

    // Register a company/manufacturer
    function registerCompany(string memory _name, string memory _email) external {
        require(!companies[msg.sender].isRegistered, "Company already registered");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_email).length > 0, "Email cannot be empty");

        companies[msg.sender] = Company({
            name: _name,
            email: _email,
            walletAddress: msg.sender,
            isRegistered: true,
            registeredAt: block.timestamp
        });

        companyCount++;
        emit CompanyRegistered(msg.sender, _name, block.timestamp);
    }

    // Register a product on the blockchain
    function registerProduct(
        string memory _name,
        string memory _serialNumber
    ) external onlyRegisteredCompany {
        require(bytes(_name).length > 0, "Product name cannot be empty");
        require(bytes(_serialNumber).length > 0, "Serial number cannot be empty");
        require(!products[_serialNumber].exists, "Product with this serial already registered");

        productCount++;
        products[_serialNumber] = Product({
            id: productCount,
            name: _name,
            serialNumber: _serialNumber,
            manufacturer: companies[msg.sender].name,
            registeredAt: block.timestamp,
            registeredBy: msg.sender,
            exists: true,
            isAuthentic: true
        });

        companyProducts[msg.sender].push(_serialNumber);

        emit ProductRegistered(_serialNumber, _name, msg.sender, block.timestamp);
    }

    // Verify product authenticity
    function verifyProduct(string memory _serialNumber) 
        external 
        view 
        returns (
            bool exists,
            bool isAuthentic,
            string memory name,
            string memory manufacturer,
            uint256 registeredAt
        ) 
    {
        if (!products[_serialNumber].exists) {
            return (false, false, "", "", 0);
        }

        Product memory p = products[_serialNumber];
        return (p.exists, p.isAuthentic, p.name, p.manufacturer, p.registeredAt);
    }

    // Get company info
    function getCompany(address _wallet) external view returns (
        string memory name,
        string memory email,
        bool isRegistered,
        uint256 registeredAt
    ) {
        Company memory c = companies[_wallet];
        return (c.name, c.email, c.isRegistered, c.registeredAt);
    }

    // Get all products of a company
    function getCompanyProducts(address _company) external view returns (string[] memory) {
        return companyProducts[_company];
    }

    // Get product details
    function getProduct(string memory _serialNumber) external view 
        productExists(_serialNumber)
        returns (Product memory) 
    {
        return products[_serialNumber];
    }

    // Check if company is registered
    function isCompanyRegistered(address _wallet) external view returns (bool) {
        return companies[_wallet].isRegistered;
    }
}
