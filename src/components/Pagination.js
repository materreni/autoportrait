import React, {useState, useRef, useEffect}  from 'react';
import PropTypes from 'prop-types';
import PaginationItem from './PaginationItem.js';

//builds pagination array for looping in each new page
function buildPagesNavigation(currentPage, paginationUserConfig, totalNodes, cssNumbrLimit, paginationText, lang){
	
	const maxNumsInNav = (paginationUserConfig.maxNumsInNav < cssNumbrLimit.current) ? paginationUserConfig.maxNumsInNav : cssNumbrLimit.current;
	const	cantPages	= Math.ceil(totalNodes / paginationUserConfig.nodesPerPage);

	let start, topLimit;
	const buttons = [];

	//pageNav behaviour for number buttons
	if(maxNumsInNav >= cantPages){ //limit for big numbers
		start = 0;
	 	topLimit = cantPages;
	}else	if(currentPage < maxNumsInNav){ //first n pages
	 	start = 0;
	 	topLimit = maxNumsInNav;
	}else if((currentPage + maxNumsInNav) > cantPages ){ //last n pages
		start = cantPages - maxNumsInNav; 
		topLimit = cantPages; 
	}else{ //middle pages
		start = maxNumsInNav * Math.floor(currentPage / maxNumsInNav);
		topLimit = start + maxNumsInNav;
		//add current page button, off-logic
		buttons.push({ pageNum: start, url: `./${start}/` });
		/*TODO: depending on amount of visible numbers it
		doesn't work the same if going backwards with prev button*/
	}

	//build pageNav (only number buttons)
	for(let i = start; i < topLimit; i++){
		buttons.push({ pageNum: i + 1, url: `./${i + 1}/` });
	}

	//add last page button and "..." to pageNav
	const dotsStart	= { pageNum: "skiped-start", label: "...", css: "skiped-pages" };
	const dotsEnd	= { pageNum: "skiped-end", label: "...", css: "skiped-pages" };
	const firstPageButton = { pageNum: 1, url: "./1/" }
	const lastPageButton = { pageNum: cantPages, url: `./${cantPages}/` }

	if(maxNumsInNav < cantPages){ //don't add for values > total pages
		if(currentPage < maxNumsInNav){ //first pages behaviour
			if(!(maxNumsInNav + 1 === cantPages)){
				buttons.push(dotsEnd);
			}
			buttons.push(lastPageButton);
		}else if((currentPage + maxNumsInNav) > cantPages){ //last pages behaviour
			if(!(maxNumsInNav + 1 === cantPages)){
				buttons.unshift(dotsStart);
			}
			buttons.unshift(firstPageButton);
		}else{ //middle (rest of the) pages behaviour
			buttons.unshift(dotsStart)
			buttons.unshift(firstPageButton);

			//don't add if last page exists in reciently built pageNav
			let lastPageExists = false;
			for(let i = 0; i < buttons.length; i++){
				if(buttons[i].pageNum === cantPages){
					lastPageExists = true;
					break;
				}	
			}
			
			if(!lastPageExists){
				buttons.push(dotsEnd);
				buttons.push(lastPageButton);
			}
		}
	}

	//add prev/next buttons to pageNav
	buttons.unshift({ pageNum: "prev-pages", label: `${paginationText.prevBtn[lang]} ${(currentPage !== 1) ? currentPage - 1 : null }`, css: "prev-arrow", url: (currentPage !== 1) ? `./${currentPage - 1}/` : null , pagenum: (currentPage !== 1) ? currentPage - 1 : null });
	buttons.push({ pageNum: "next-pages", label: `${paginationText.nextBtn[lang]} ${(currentPage < cantPages) ? currentPage + 1 : null }`, css: "next-arrow", url: (currentPage < cantPages) ? `./${currentPage + 1}/` : null , pagenum: (currentPage < cantPages) ? currentPage + 1 : null });

	return buttons;
}


function Pagination({ paginationUserConfig, totalNodes, currentPage, handlerCurrentPage, paginationText, lang, paginatorWrapper, lastSectionUrlName, langDefault }){
	//cssNumbrLimit: mediaqueried max limit of numbers in navigation imported from css file		
	const cssNumbrLimit = useRef(Number(window.getComputedStyle(document.body, '::before').content.replace(/"/g, '')));
	const [pagesNavigation, setPagesNavigation] = useState([]);

	//build/rebuild pages navigation
	useEffect( () => {	
		setPagesNavigation(buildPagesNavigation(currentPage, paginationUserConfig, totalNodes, cssNumbrLimit, paginationText, lang));
	}, [currentPage, setPagesNavigation, paginationUserConfig, totalNodes, paginationText, lang]);

	return(
		<nav ref={paginatorWrapper} className="pagination-wrapper" aria-label={`${paginationText.navAriaLabel[lang]} ${Math.ceil(totalNodes / paginationUserConfig.nodesPerPage)} ${paginationText.page[lang]}s total`}>
			<ul className="pagination" role="presentation">
				{pagesNavigation.map(item => (
					<PaginationItem key={item.pageNum} item={item} currentPage={currentPage} handlerCurrentPage={handlerCurrentPage} paginationText={paginationText} lang={lang} lastSectionUrlName={lastSectionUrlName} langDefault={langDefault} />
				))}
			</ul>
		</nav>
	)
}

PaginationItem.propTypes = {
	item : PropTypes.shape({
		pageNum : PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]).isRequired,
		url : PropTypes.string,
		css : PropTypes.string,
		label : PropTypes.string
	}),
	currentPage : PropTypes.number.isRequired,
	handlerCurrentPage : PropTypes.func.isRequired,
	paginationText : PropTypes.object.isRequired,
	lang : PropTypes.string.isRequired,
	lastSectionUrlName : PropTypes.string.isRequired,
	langDefault: PropTypes.string.isRequired
}

export default Pagination;