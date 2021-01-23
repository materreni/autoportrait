import React, { useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import LeveNode from './LeveNode.js';
import Pagination from './Pagination.js';

const paginationText = {
	page : {	
		en : "page",
		es : "página"
	},
	pageBtn : {	
		en : "Page",
		es : "Página"
	},
	prevBtn : {	
		en : "Previous page:",
		es : "Página anterior:"
	},
	nextBtn : {	
		en : "Next page:",
		es : "Página siguiente:"
	},
	navAriaLabel : {	
		en : "Pagination:",
		es : "Paginador:"
	},
	ellipsesAria : {
		en : "ellipses",
		es : "puntos suspensivos"
	}
};	

function LeveNodesContainer({ nodes, paginationUserConfig, totalNodes, currentPage, setCurrentPage, lang, lastSectionPrettyName, lastSectionUrlName, pageOf, sectionTitleEl, rendersCounter, aboutFocus, setAboutFocus, aboutCallback, langDefault, changeHTMLTitle, pushBrowserHistory, data, activeOrder, aboutId, setLastSectionPrettyName, setLastSectionUrlName }){
	const [pageNodes, setPageNodes] = useState([]);
	const nodesList = useRef();
	const paginatorWrapper = useRef();


	useEffect( () => {
		const sliceInit = (currentPage - 1) * paginationUserConfig.nodesPerPage;
		const sliceEnd = paginationUserConfig.nodesPerPage * currentPage;
		setPageNodes([...nodes].slice(sliceInit, sliceEnd));
	}, [nodes, currentPage, setPageNodes, paginationUserConfig]);


	//PAGE SCROLL & FOCUS: scroll to top and move focus to section title when intersected
	useEffect( () => {

		if(rendersCounter.current > 1 && aboutFocus === '' && aboutCallback.current === false){ 
		//aboutFocus makes sure "About" modal isn't active

	    sectionTitleEl.current.scrollIntoView({ 
	    	behavior: "smooth" 
	    });
    	
			if('IntersectionObserver' in window){
				const moveFocus = () => {
					sectionTitleElObserver.unobserve(sectionTitleEl.current);
					sectionTitleElObserver = null;
					//give time for smooth scrolling to finish
					const focusTimer = window.setTimeout(function () {
			      sectionTitleEl.current.focus();
			      clearTimeout(focusTimer);
			    }, 800);
					
				}

				let sectionTitleElObserver = new IntersectionObserver(moveFocus, { threshold : 1.0 });				
				sectionTitleElObserver.observe(sectionTitleEl.current);	
			}	

    }else if(rendersCounter.current > 1 && aboutCallback.current === true){ 
			aboutCallback.current = false;
    }else{
    	rendersCounter.current++;
    }

	}, [pageNodes, aboutFocus, setAboutFocus, aboutCallback, rendersCounter, sectionTitleEl]);


	//PAGINATION: intersection obs to hide/show pagination at specific positions
	useEffect( () => {	
		const pagObsOptions = { root: null, rootMargin: '0px 0px -50% 0px', threshold: 0 }

		if('IntersectionObserver' in window){
			let pagObserver = new IntersectionObserver(togglePag, pagObsOptions);
		
			let target = nodesList.current;
			const paginator = paginatorWrapper.current;
			pagObserver.observe(target);
			
			function togglePag(e){
				if(e[0].isIntersecting){
					paginator.classList.add('pagination-wrapper-fixed');
				}else{
					paginator.classList.remove('pagination-wrapper-fixed');
				}
			}
		}	
	}, []);


	function handlerCurrentPage(e){
		e.preventDefault();
		if(e.target.id){ //pagination numbers
      setCurrentPage(Number(e.target.id));
		}else{ //pagination arrows
      setCurrentPage(Number(e.currentTarget.dataset.page));
		}
		const sectionUrlName = changeHTMLTitle(lang, data, activeOrder, aboutId.current, Number(e.target.id), totalNodes, paginationUserConfig.nodesPerPage, setLastSectionPrettyName, setLastSectionUrlName);
		pushBrowserHistory(false, lang, sectionUrlName, Number(e.target.id), data.langDefault)				
	}
	
	/* Count foonotes for <a> text, feeds prop looped by map */
	let ftnoteNum = 1;

	return(
		<section>

			<h2 ref={sectionTitleEl} className="sr-only" tabIndex="-1">{`${lastSectionPrettyName}: ${paginationText.page[lang]} ${currentPage} ${pageOf} ${Math.ceil(totalNodes / paginationUserConfig.nodesPerPage)}`}</h2>
			<ul className="autoportrait-nodes" ref={nodesList}>
				{pageNodes.map( node => (
					<LeveNode key={node.id} nodeId={node.id} date={node.timestamp} likes={node.likes} lang={lang} footnote={node.nota} ftnoteNum={(node.nota && lang === "es") ? ftnoteNum++ : null}>
						{(lang === 'es') ? node.frase : node.sentence}
					</LeveNode>
				))
				}
			</ul>
			<Pagination paginationUserConfig={paginationUserConfig} totalNodes={totalNodes} currentPage={currentPage} handlerCurrentPage={handlerCurrentPage} paginationText={paginationText} lang={lang} paginatorWrapper={paginatorWrapper} lastSectionUrlName={lastSectionUrlName} langDefault={langDefault} />
		</section>
	)
}


LeveNode.propTypes = {
	nodeId : PropTypes.number.isRequired,
	date : PropTypes.number.isRequired,
	likes : PropTypes.number.isRequired,
	lang : PropTypes.string.isRequired,
	footnote : PropTypes.string,
	ftnoteNum : PropTypes.number,
	children : PropTypes.string.isRequired
}


Pagination.propTypes = {
	paginationUserConfig : PropTypes.object.isRequired,
	totalNodes : PropTypes.number.isRequired,
	currentPage : PropTypes.number.isRequired,
	handlerCurrentPage : PropTypes.func.isRequired,
	paginationText: PropTypes.shape({
		page : PropTypes.shape({
			en : PropTypes.string.isRequired,
			es : PropTypes.string.isRequired
		}),
		pageBtn : PropTypes.shape({
			en : PropTypes.string.isRequired,
			es : PropTypes.string.isRequired
		}), 
		prevBtn : PropTypes.shape({
			en : PropTypes.string.isRequired,
			es : PropTypes.string.isRequired
		}), 
		nextBtn : PropTypes.shape({
			en : PropTypes.string.isRequired,
			es : PropTypes.string.isRequired
		}), 
		navAriaLabel : PropTypes.shape({
			en : PropTypes.string.isRequired,
			es : PropTypes.string.isRequired
		}),
		ellipsesAria : PropTypes.shape({
			en : PropTypes.string.isRequired,
			es : PropTypes.string.isRequired
		})
	}),
	lang : PropTypes.string.isRequired
}


export default LeveNodesContainer;