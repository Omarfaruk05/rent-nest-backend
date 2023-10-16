"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HouseFilterableFields = exports.HouseSearchableFields = exports.PropertyType = exports.Interior = exports.Availabale = exports.GAS = void 0;
exports.GAS = ["LPG", "Govt"];
exports.Availabale = ["AVAILABLE", "BOOKED"];
exports.Interior = ["Furnished", "Un_Furnished"];
exports.PropertyType = ["Furnished", "Residential", "Luxury"];
exports.HouseSearchableFields = [
    "name",
    "address",
    "yearBuilt",
    "city",
    "interior",
    " status",
    "ownerId",
];
exports.HouseFilterableFields = [
    "searchTerm",
    "propertyId",
    "address",
    "city",
    "interior",
    "status",
    "city",
    "ownerId",
    "bedrooms",
    "numberOfBalcony",
    "rentPerMonth",
];
