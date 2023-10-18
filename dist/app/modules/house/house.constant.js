"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HouseFilterableFields = exports.HouseSearchableFields = exports.PropertyType = exports.Interior = exports.Availabale = exports.GAS = void 0;
exports.GAS = ["LPG", "Govt"];
exports.Availabale = ["AVAILABLE", "BOOKED"];
exports.Interior = ["Furnished", "Un_Furnished"];
exports.PropertyType = ["Furnished", "Residential", "Luxury"];
exports.HouseSearchableFields = [
    "name",
    "city",
    "address",
    "roomSize",
    "propertyId",
];
exports.HouseFilterableFields = [
    "searchTerm",
    "propertyType",
    "interior",
    "gas",
    "status",
    "ownerId",
];
