
import { Product } from "./types";

export const products: Product[] = [
  {
    id: "1",
    name: "Medical Grade Latex Gloves",
    description: "Box of 100 premium latex examination gloves",
    category: "Safety",
    image: "/placeholder.svg",
    price: 15.99,
    stock: 500,
  },
  {
    id: "2",
    name: "Printer Paper",
    description: "500 sheets of high-quality printer paper",
    category: "Paper",
    image: "/placeholder.svg",
    price: 8.99,
    stock: 1000,
  },
  {
    id: "3",
    name: "Ballpoint Pens",
    description: "Pack of 12 blue ballpoint pens",
    category: "Writing",
    image: "/placeholder.svg",
    price: 4.99,
    stock: 200,
  },
  {
    id: "4",
    name: "Surgical Masks",
    description: "Box of 50 disposable surgical masks",
    category: "Safety",
    image: "/placeholder.svg",
    price: 12.99,
    stock: 300,
  },
  {
    id: "5",
    name: "Hand Sanitizer",
    description: "500ml medical-grade hand sanitizer",
    category: "Safety",
    image: "/placeholder.svg",
    price: 6.99,
    stock: 400,
  },
  {
    id: "6",
    name: "Sticky Notes",
    description: "Pack of 12 sticky note pads",
    category: "Paper",
    image: "/placeholder.svg",
    price: 7.99,
    stock: 150,
  },
];

export const categories = [...new Set(products.map((p) => p.category))];
