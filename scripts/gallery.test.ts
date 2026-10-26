import test from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_FILTERS, filterGallery, galleryQuery, readGalleryFilters, type GalleryProduct } from "../src/lib/gallery";
const products: GalleryProduct[] = [
  {id:"new",name:"Amber vase",category:"Vases",description:"A tall piece",price:150,images:[],maker:"Fenton",era:"1940s",status:"AVAILABLE"},
  {id:"reserved",name:"Crystal bowl",category:"Decor",description:"Clear cut glass",price:50,images:[],status:"RESERVED"},
  {id:"sold",name:"Blue goblet",category:"Glasses",description:"A vintage cup",price:25,images:[],status:"SOLD"},
];
test("search trims space and matches maker, era and category across terms",()=>{
 assert.deepEqual(filterGallery(products,{...DEFAULT_FILTERS,query:"  FENTON 1940s "},[]).map(p=>p.id),["new"]);
 assert.equal(filterGallery(products,{...DEFAULT_FILTERS,query:"decor clear"},[])[0].id,"reserved");
});
test("available only excludes sold and reserved pieces",()=>assert.deepEqual(filterGallery(products,{...DEFAULT_FILTERS,available:true},[]).map(p=>p.id),["new"]));
test("saved, category and search filters compose",()=>assert.deepEqual(filterGallery(products,{...DEFAULT_FILTERS,saved:true,category:"Decor",query:"crystal"},["new","reserved"]).map(p=>p.id),["reserved"]));
test("price sorting uses numbers and does not mutate the original arrival order",()=>{
 assert.deepEqual(filterGallery(products,{...DEFAULT_FILTERS,sort:"price-asc"},[]).map(p=>p.price),[25,50,150]);
 assert.deepEqual(filterGallery(products,{...DEFAULT_FILTERS,sort:"price-desc"},[]).map(p=>p.price),[150,50,25]);
 assert.equal(products[0].id,"new");
});
test("alphabetical sorting and default arrival order",()=>{
 assert.deepEqual(filterGallery(products,{...DEFAULT_FILTERS,sort:"name"},[]).map(p=>p.id),["new","sold","reserved"]);
 assert.deepEqual(filterGallery(products,DEFAULT_FILTERS,[]).map(p=>p.id),["new","reserved","sold"]);
});
test("URL serialization round-trips punctuation and filters",()=>{
 const filters={...DEFAULT_FILTERS,category:"Vases & bowls",query:"Fenton + glass",saved:true,available:true,sort:"price-asc" as const};
 assert.deepEqual(readGalleryFilters(new URLSearchParams(galleryQuery(filters))),filters);
});
test("invalid sort parameters fall back, queries are bounded, default URL is clean",()=>{
 assert.equal(readGalleryFilters(new URLSearchParams("sort=unknown")).sort,"newest");
 assert.equal(readGalleryFilters(new URLSearchParams("q="+"a".repeat(500))).query.length,150);
 assert.equal(galleryQuery(DEFAULT_FILTERS),"");
});
test("empty results and empty saved collection are explicit",()=>{
 assert.deepEqual(filterGallery(products,{...DEFAULT_FILTERS,query:"nonexistent"},[]),[]);
 assert.deepEqual(filterGallery(products,{...DEFAULT_FILTERS,saved:true},[]),[]);
});
