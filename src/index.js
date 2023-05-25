import "./index.html";
import "./index.scss";
import {mult, sum} from "./modules/calc";
import code from "../src/img/code.png";

const imgWrap = document.querySelector('.img')
const img = new Image()
img.src = code
img.width = 500
imgWrap.append(img)


console.log(mult(3, 4))
console.log(sum(3, 4))
