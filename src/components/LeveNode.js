import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Time from './Time.js';
import LeveNodeText from './LeveNodeText.js';

const dataLiked = {
	text : {
		en : 'I like it!',
		es : '¡Me gusta!'
	},
	times : {
		en : 'like',
		es : 'me gusta'
	}
}

function LeveNode({ children, nodeId, date, likes, lang, footnote, ftnoteNum}){
	const [nodeLikes, setNodeLikes] = useState(likes + (localStorage.getItem(nodeId) ? 1 : 0))
	const [liked, setLiked] = useState(localStorage.getItem(nodeId) || null);


	//Visual number starts at 01, add "0" to 1-9 values
	let nodeIdString = nodeId + 1; 
	if(nodeIdString.toString().length < 2){
	 nodeIdString = `0${nodeIdString}`;
	}

	//Likes
	useEffect( () => {
		if(liked !== null){
			localStorage.setItem(nodeId, true);
		}else{
			localStorage.removeItem(nodeId);
		}
	}, [liked, nodeId]); 

	function likeHandler(e){
		if(liked === null){
			setLiked(nodeId);
			setNodeLikes(nodeLikes + 1);
		}else{
			setLiked(null);
			setNodeLikes(nodeLikes - 1);
		}
	}

	return(
		<li className={(liked !== null) ? "node-text-liked" : null}>
			<p className="node-number">{nodeIdString}</p>
			<p className="node-date"><Time date={date} lang={lang} /></p>
			<LeveNodeText lang={lang} liked={liked} footnote={footnote} ftnoteNum={ftnoteNum}>{children}</LeveNodeText>
			<button className="btn-like" onClick={likeHandler} aria-pressed={(liked !== null) ? "true" : "false"}>
				<svg xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="37" height="52" viewBox="0 0 37 52">
					<defs><filter id="shadow"><feDropShadow dx="2" dy="3" stdDeviation="0.5" floodColor="cyan"/></filter></defs>	
	         <polygon fillRule="evenodd" clipRule="evenodd" fill="#F7F406" points="2.39,27.14 18.08,27.09 12.62,47.88 36.71,19.31 21.18,19.08 23.56,0 "/>
	         <path  fillRule="evenodd" clipRule="evenodd" fill="none" stroke="#000000" strokeWidth="1" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" d="M0.5,29.56l14.44-0.2l-4.36,18.28c0,0,21.92-25.88,21.92-26.25c0-0.36-14.17-0.2-14.17-0.2l3.12-18.57L0.5,29.56z"/>
         </svg>
				<span className="sr-only">{dataLiked.text[lang]}(</span>{nodeLikes}<span className="sr-only"> {`${dataLiked.times[lang]}${(nodeLikes === 1) ? '' : 's'}`} </span>
			</button>
		</li>
	)
}

Time.propTypes = {
	date : PropTypes.number.isRequired,
	lang : PropTypes.string.isRequired
}

LeveNodeText.propTypes = {
	lang : PropTypes.string.isRequired,
	liked : PropTypes.oneOfType([
		PropTypes.number, //nodeId
		PropTypes.string //null is received as string
	]),
	footnote : PropTypes.string,
	ftnoteNum : PropTypes.number,
	children : PropTypes.string.isRequired
}

export default LeveNode;