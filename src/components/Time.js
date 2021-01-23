import React from 'react';

const textosDate = {
	seconds : {
		en : "Just posted",
		es : "Hace segundos"
	},
	minutes : {
		en : "min",
		es : "min"
	},
	hours : {
		en : "h",
		es : "h"
	},
	days : {
		en : "day",
		es : "día"
	},
	weeks : {
		en : "week",
		es : "semana"
	},
	months : {
		en : "month",
		es : "mes"
	},
	years : {
		en : "year",
		es : "año"
	}
};

function periodo(date, lang){
	const posted = new Date(date);
	const now = new Date(); //debería tomarse del server
	const zoneMseconds = now.getTimezoneOffset() * 60 * 1000;
	const nowClient = now - zoneMseconds;
	const difTime = nowClient - posted;
	const seconds = Math.floor(difTime / 1000);
	let periodo = textosDate.seconds[lang];	
	if(seconds > 60 && seconds < 3600){
		let mins = Math.floor(difTime / (1000 * 60));
		let plur = (mins === 1) ? "" : "s";
		periodo += `${mins} ${textosDate.minutes[lang]}${plur}`;
	}else if(seconds > 3600 && seconds < 86400){
		let hs = Math.floor(difTime / (1000 * 60 * 60));
		let plur = (hs === 1) ? "" : "s";
		periodo = `${hs} ${textosDate.hours[lang]}${plur}`;
	}else if(seconds > 86400 && seconds < 604800){
		let days = Math.floor(difTime / (1000 * 60 * 60 * 24));
		let plur = (days === 1) ? "" : "s";
		periodo = `${days} ${textosDate.days[lang]}${plur}`;
	}else if(seconds > 604800 && seconds < 2419200){
		let weeks = Math.floor(difTime / (1000 * 60 * 60 * 24 * 7));
		let plur = (weeks === 1) ? "" : "s";
		periodo = `${weeks} ${textosDate.weeks[lang]}${plur}`;	
	}else if(seconds > 2419200 && seconds < 31536000){
		let months = Math.floor(difTime / (1000 * 60 * 60 * 24 * 7 * 4));
		let plur = "";
		if(months > 1){
			plur = (lang === "es") ? "es" : "s";
		}
		periodo = `${months} ${textosDate.months[lang]}${plur}`;
	}else if(seconds > 31536000){
		let years = Math.floor(difTime / (1000 * 60 * 60 * 24 * 365));
		let plur = (years === 1) ? "" : "s";
		periodo = `${years} ${textosDate.years[lang]}${plur}`;
	}
	if(seconds > 60 && lang === "en"){
		periodo += " ago";		
	}else if(seconds > 60 && lang === "es"){
		periodo = "Hace " + periodo;
	}
	return periodo;
}


const Time = ({ date, lang }) => {	
	return(
		<time dateTime={new Date(date).toISOString()}>{periodo(date, lang)}</time>
	)
};

export default Time;