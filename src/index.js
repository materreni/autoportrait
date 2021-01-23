import React, { useState, useReducer, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Header from './components/Header.js';
import LeveNodesContainer from './components/LeveNodesContainer.js';
import About from './components/About.js';

import './css/autoportrait.css'


const homeData = {
	title : {
		en : 'Autoportrait',
		es : 'Autorretrato'
	},
	author : {
		en : 'Edouard Leve',
		es : 'Edouard Leve'
	},
	desc : {
		en : 'I am a bot. Everyday a new sentence from the book <a href="https://denniscooperblog.com/spotlight-on-edouard-leve-autoportrait-2012-2/"><strong>Autoportrait</strong>&nbsp;(2005)</a> by Edouard Levé. Translation by Lorin Stein.',
		es : 'Soy un bot. Todos los días publico una frase del libro <a href="https://www.telam.com.ar/notas/201609/165195-libro-de-la-semana-alan-pauls-autorretrato-edouard-leve.html"><strong>Autorretrato</strong>&nbsp;(2005)</a> de Édouard Levé. La traducción es de Matías Battistón.'
	},
	menu: [
		{	
			id : '01-recent',
			en : {
				name : 'Recent',
				url : 'recent'
			},
			es : {
				name : 'Recientes',
				url : 'recientes'
			}
		},{
			id : '02-popular',
			en : {
				name : 'Popular',
				url : 'popular'
			},
			es : {
				name : 'Populares',
				url : 'populares'
			}
		},{
			id : '03-random',
			en : {
				name : 'Random',
				url : 'random'
			},
			es : {
				name : 'Aleatorios',
				url : 'aleatorios'
			}
		},{
			id : '04-about',
			en : {
				name : 'About',
				url : 'about'
			},
			es : {
				name : 'Créditos',
				url : 'creditos'
			}
		}
	],
	loading: {
		en : 'Loading text nodes...',
		es : 'Cargando nodos de texto...'
	},
	titleBy: {
		en : 'by',
		es : 'de'
	},
	pageOf: {
		en : 'of',
		es : 'de'
	},
	langDefault: 'en',
	menuDefault: { //must mimic data.menu
		index: 0, 
		id : '01-recent'
	}
}

const reduceReorder = (state, action) => {
	//there's an init state (action.nodes !== undefined) for every section 
	//in case direct access to url in a specific section also needs to load json
	switch(action.type){

		case '02-popular':
			const comparison = (a,b) => a.likes < b.likes ? 1 : -1; //max to min
			let mostLiked;
			if(action.nodes !== undefined){
				mostLiked = [...action.nodes].sort(comparison);
				state = {
					original : [...action.nodes],
					reordered : mostLiked
				};
			}else{
				mostLiked = [...state.original].sort(comparison);
				state = {
					...state,
					reordered : mostLiked
				};
			}

		return state;

		case '03-random':

			let nodes, size;

			if(action.nodes !== undefined){
				nodes = [...action.nodes];
				size = nodes.length

				while (size--) {
					const i = Math.floor(Math.random() * size);
					const tmp = nodes[i];
					nodes[i] = nodes[size];
					nodes[size] = tmp;			
				}

				state = {
					original : [...action.nodes],
					reordered : [...nodes]
				}

			}else{
				nodes = [...state.original];
				size = nodes.length;

				while (size--) {
					const i = Math.floor(Math.random() * size);
					const tmp = nodes[i];
					nodes[i] = nodes[size];
					nodes[size] = tmp;			
				}

				state = {
					...state,
					reordered : [...nodes]
				}			
			}	

		return state;

		case '04-about': //return last state
			
			if(action.nodes !== undefined){ 
				state = {
					original : action.nodes,
					reordered : [...action.nodes]
				};
			}

		return state;

		default:
			if(action.nodes !== undefined){ //after json fetch in useEffect, for home url 
				state = {
					original : action.nodes,
					reordered : [...action.nodes]
				};
			}else{	//resets prior rearrengements (01-recent)
				state = {
					...state,
					reordered : [...state.original]
				}
			}

		return state;
	}
}


const changeHTMLTitle = (language, data, activeOrder, aboutId, currentPage, totalNodes, nodesPerPage, setLastSectionPrettyName, setLastSectionUrlName, homePage ) => {

		let sectionNiceName, sectionUrlName;
		for(let i = 0; i < data.menu.length; i++){ 
			if(data.menu[i].id === activeOrder){ 
				sectionNiceName = data.menu[i][language]["name"];
				sectionUrlName = data.menu[i][language]["url"];;
				break;
			}
		}

		setLastSectionPrettyName(lastSectionPrettyName => sectionNiceName);
		setLastSectionUrlName(lastSectionUrlName => sectionUrlName);

		let page = '';
		if(activeOrder !== aboutId){
			page = (currentPage > 1) ? `(${currentPage} ${data.pageOf[language]} ${Math.ceil(totalNodes / nodesPerPage)})` : '';
		}

		if(!homePage){
   		document.title = `${sectionNiceName} ${page} |  ${data.title[language]} (2005) ${data.titleBy[language]} ${data.author[language]}`;
		}else{
			document.title = `${data.title[language]} (2005) ${data.titleBy[language]} ${data.author[language]}`;
		}

   	return sectionUrlName;
}


//Writes URL and History, fed by regular navigation or historyAPIRouter
const pushBrowserHistory = (domainCodes, lang, section, page, langDefault) => {
	let originUrl = window.location.origin;

	let sectionUrl = (section !== '') ? `${section}/` : '';
	let pageUrl = (page !== '' && page > 1) ? `${page}/` : '';
	let langUrl = (lang !== langDefault) ? `${lang}/` : '';
	const url = originUrl + '/' + langUrl + sectionUrl + pageUrl;

	if(domainCodes === "404"){
		if(langUrl){
			window.history.replaceState(null, null, originUrl + '/' + langUrl);
		}else{
			window.history.replaceState(null, null, originUrl);
		}
	}else if(domainCodes === "direct-link"){
		window.history.replaceState({id : `${lang}-${section}-${page}`}, null, url);
	}else{
		window.history.pushState({id : `${lang}-${section}-${page}`}, null, url);
	}
}


//Router for history and direct links to anywhere, PARSES URL, returns parameters
const historyAPIRouter = (menuItems, langDefault, totalNodes, nodesPerPage, pageLess) => {
	let sectionMatch, langMatch, pageMatch;
	const languageKeys = Object.keys(menuItems[0]);

	found:
	for(let i = 0; i < menuItems.length; i++){ //as many menu items as there are				
		for(let e = 1; e < languageKeys.length; e++){ //as many languages as there are, starts at 1 so we skip id

			/* Check if a section name exists */
			const regexSection = new RegExp("/" + menuItems[i][languageKeys[e]]["url"] + "/");
			const searchSection = window.location.pathname.match(regexSection);	

			if(searchSection){ 

				/* Check if there's a declared lang */
				const regexLang = new RegExp("/" + languageKeys[e] + "/");
				const searchLang = window.location.pathname.match(regexLang);
				langMatch = (searchLang) ? searchLang[0].split("/")[1] : null;
				langMatch = (langDefault === languageKeys[e]) ? languageKeys[e] : langMatch;
				
				let langString;
				if(langMatch === langDefault){
					langString = '';
				}else if(langMatch){
					langString = "/" + langMatch;
				}

				/* Check if there's an optional page number */
				const searchPage = window.location.pathname.match(/[0-9]+/);
				pageMatch = (searchPage) ? Number(searchPage[0]) : null;									
				
				/* Discard page optional */
				let pageString = '';
				const maxPages = Math.ceil(totalNodes / nodesPerPage);		
				if(pageMatch && pageMatch <= maxPages){						
			  	pageString = pageMatch + "/";
				}else{
					pageString = '';
				}

				//compare original url with url assembled
				//from regExp matches to discard any weirdness
				if(window.location.pathname === langString + searchSection + pageString){
					sectionMatch = menuItems[i].id;
					if(sectionMatch === pageLess){
						pageMatch = '';
					}
				}else if(sectionMatch === pageLess && pageMatch !== ''){
					//if pageless section has pages in the URL
					sectionMatch = "404";	
				}else{
					sectionMatch = "404";
				}

				break found;	
			}else{
				sectionMatch = "final-home-check";
			}

		}
	}

	if(sectionMatch === "final-home-check"){
		let regexLangHome, searchLangHome; 
		for(let e = 1; e < languageKeys.length; e++){ //starts in 1 to skip "id"
			regexLangHome = new RegExp("/" + languageKeys[e] + "/");
			searchLangHome = window.location.pathname.match(regexLangHome);
			if(searchLangHome){
				langMatch = languageKeys[e];
				break;
			}
		}

		if(window.location.pathname === "/"){
			sectionMatch = "default-home";
			langMatch = langDefault;
		}else if(searchLangHome && window.location.pathname === searchLangHome[0]){
			sectionMatch = "default-home";
		}else{
			sectionMatch = "404";
		}
	}

	if(sectionMatch === "404"){
		return [sectionMatch, null, null];	
  }else if(sectionMatch === "default-home"){
		return [sectionMatch, null, langMatch];
  }else if(sectionMatch){
		return [sectionMatch, pageMatch, langMatch];
  }

}

function Autoportrait({ data }){
	const [language, setLanguage] = useState(localStorage.getItem('language') || data.langDefault);
	const [leveNodesData, dispatchNodes] = useReducer(reduceReorder, {'original': [], 'reordered': []});
	const [activeOrder, setActiveOrder] = useState(data.menuDefault.id);
	const [currentPage, setCurrentPage] = useState(1);
	const [menuItemBeforeAbout, setMenuItemBeforeAbout] = useState(data.menuDefault.id); //this is never About section
	const [lastSectionPrettyName, setLastSectionPrettyName] = useState(data.menu[data.menuDefault.index][localStorage.getItem('language') || data.langDefault]["name"]);
	const [lastSectionUrlName, setLastSectionUrlName] = useState(data.menu[data.menuDefault.index][localStorage.getItem('language') || data.langDefault]["url"]);
	const aboutId = useRef(data.menu[3].id);
	const [aboutFocus, setAboutFocus] = useState(''); //to return focus to "About" after triggering a modal window
	const aboutCallback = useRef(false); //triggers after About modal is closed to prevent automatic-scroll
	const totalNodes = useRef(0);
	const wrapper = useRef();
	const sectionTitleEl = useRef();
	const rendersCounter = useRef(0); //used by ScrollToView
	const aboutFromHistory = useRef(false);
	const paginationUserConfig = useRef({
		firstPage: 1,
		nodesPerPage: 80, 
		maxNumsInNav: 10 //aprox numbers visible at the same time in page navigation
	});


	/*--------------*/
	// request jSON //
	/*--------------*/
	useEffect( () => {
		fetch('/json/autoportrait.json')
		.then(
			function(response) {
      	if(!response.ok) {
          throw Error(response.statusText);
      	}
      	return response.json();
    	}
		).then(json => {
			const now = new Date(); 
			const zoneMseconds = now.getTimezoneOffset() * 60 * 1000;
			const nowClient = now - zoneMseconds; //instead of client "now" should be server time
			const published = [];
			
			for(let i = 0; i < json.autorretrato.length; i++){
				if(json.autorretrato[i].timestamp > nowClient){
					break;
				}
				published.push(json.autorretrato[i]);				
			}

			totalNodes.current = published.length;

			const [sectionIdFromUrl, pageFromUrl, langFromUrl] = historyAPIRouter(data.menu, data.langDefault, totalNodes.current, paginationUserConfig.current.nodesPerPage, aboutId.current);

			if(sectionIdFromUrl === "default-home"){
				
				if(langFromUrl !== (localStorage.getItem('language') || data.langDefault)){ 
					setLanguage(langFromUrl);
					localStorage.setItem('language', langFromUrl);
					changeHTMLTitle(langFromUrl, data, data.menuDefault.id, aboutId.current, '', totalNodes.current, paginationUserConfig.current.nodesPerPage, setLastSectionPrettyName, setLastSectionUrlName, true);
					rendersCounter.current = rendersCounter.current - 1;
				}
			
				dispatchNodes({ nodes: published });

			}else if(sectionIdFromUrl === "404"){
				
				dispatchNodes({ nodes: published });
				
				const newLang = localStorage.getItem('language') || data.langDefault;

				const sectionUrlName = changeHTMLTitle(newLang, data, data.menuDefault.id, aboutId.current, '', totalNodes.current, paginationUserConfig.current.nodesPerPage, setLastSectionPrettyName, setLastSectionUrlName, true);
				pushBrowserHistory("404", newLang, sectionUrlName, '', data.langDefault);

			}else if(aboutId.current === sectionIdFromUrl){
				
				aboutFromHistory.current = true;

				if(langFromUrl !== (localStorage.getItem('language') || data.langDefault)){ 
					setLanguage(langFromUrl);
					localStorage.setItem('language', langFromUrl);
				}

				//Build a "former" nodes order for when About modal closes
				dispatchNodes({
					nodes: published,
					type: sectionIdFromUrl
				});

				document.getElementById(sectionIdFromUrl).click();
				//A click, so HTML title and push history happen in menu button handler
			}else{
				// this is a special case as depending on the URL it can trigger events similar to those of 3 different buttons
				
				dispatchNodes({
					nodes: published,
					type: sectionIdFromUrl
				});

				setActiveOrder(activeOrder => sectionIdFromUrl);
				setMenuItemBeforeAbout(menuItemBeforeAbout => sectionIdFromUrl);

				/* these values are "optional", could happen or not
				   that's why we provide init values */

				let newLang = localStorage.getItem('language') || data.langDefault;

				if(langFromUrl && langFromUrl !== (localStorage.getItem('language') || data.langDefault)){ 
					setLanguage(langFromUrl);
					localStorage.setItem('language', langFromUrl);
					newLang = langFromUrl;
				}

				let newPage = 1;
				
				if(pageFromUrl && pageFromUrl > 1){
					setCurrentPage(pageFromUrl);
					newPage = pageFromUrl;
					rendersCounter.current = rendersCounter.current - 1; //substract extra render from page change
				}else{
					newPage = '';
				}

				const sectionUrlName = changeHTMLTitle(newLang, data, sectionIdFromUrl, aboutId.current, newPage, totalNodes.current, paginationUserConfig.current.nodesPerPage, setLastSectionPrettyName, setLastSectionUrlName);
				pushBrowserHistory("direct-link", newLang, sectionUrlName, newPage, data.langDefault);

			}
	
		}).catch(function(error) {
        console.log(error);
    });

	}, [data]); 
	//should be [], but these dependencies will never change

	/*------------------- ---------*/
	//  Back/Next Browser buttons  //
	/*-----------------------------*/
	useEffect( () => {

		window.addEventListener('popstate', function (event) {
			
			const [sectionIdFromUrl, pageFromUrl, langFromUrl] = historyAPIRouter(data.menu, data.langDefault, totalNodes.current, paginationUserConfig.current.nodesPerPage, aboutId.current);

			if(wrapper.current.getAttribute("aria-hidden") === "true"){
				//close About modal if open			
				aboutFromHistory.current = true;

				document.getElementsByClassName("about-close")[0].click();	
			
			}else if(sectionIdFromUrl === "default-home"){
				
				if(langFromUrl !== (localStorage.getItem('language') || data.langDefault)){ 
					setLanguage(langFromUrl);
					localStorage.setItem('language', langFromUrl);
				}
			
				dispatchNodes({ type: data.menuDefault.id });

				setActiveOrder(activeOrder => data.menuDefault.id);
				setMenuItemBeforeAbout(menuItemBeforeAbout => data.menuDefault.id);

				changeHTMLTitle(langFromUrl, data, data.menuDefault.id, aboutId.current, '', totalNodes.current, paginationUserConfig.current.nodesPerPage, setLastSectionPrettyName, setLastSectionUrlName, true);
	
			}else if(aboutId.current === sectionIdFromUrl){
			
				aboutFromHistory.current = true;

				if(langFromUrl !== (localStorage.getItem('language') || data.langDefault)){ 
					setLanguage(langFromUrl);
					localStorage.setItem('language', langFromUrl);
				}

				dispatchNodes({
					type: sectionIdFromUrl
				});

				document.getElementById(sectionIdFromUrl).click();
			}else{

				dispatchNodes({
					type: sectionIdFromUrl
				});

				setActiveOrder(activeOrder => sectionIdFromUrl);
				setMenuItemBeforeAbout(menuItemBeforeAbout => sectionIdFromUrl);

				let newLang = localStorage.getItem('language');

				if(langFromUrl && langFromUrl !== localStorage.getItem('language')){ 
					setLanguage(langFromUrl);
					localStorage.setItem('language', langFromUrl);
					newLang = langFromUrl;
				}

				let newPage;
				
				if(pageFromUrl){
					setCurrentPage(pageFromUrl);
					newPage = pageFromUrl;
				}else{
					setCurrentPage(1);
					newPage = 1;
				}

				changeHTMLTitle(newLang, data, sectionIdFromUrl, aboutId.current, newPage, totalNodes.current, paginationUserConfig.current.nodesPerPage, setLastSectionPrettyName, setLastSectionUrlName);

			}

		});
	}, [data]);

	/*---------------------*/
	//  Site Menu Handler  //
	/*---------------------*/
	const handlerMenu = (e) => {
		e.preventDefault();
		let sectionReducer,	sectionMenu, newPage;
		let pushHistory = false;

		//About close button
		if(e.target.classList.contains('about-close')){
			//the only case when both are different
			sectionReducer = aboutId.current;
			sectionMenu = menuItemBeforeAbout;

			setAboutFocus(sectionReducer);
			setActiveOrder(sectionMenu);	
			newPage = currentPage;

			//Hacky way to capture "click" if triggered by "about direct link" from url, it needs a different History API behaviour
			if(aboutFromHistory.current === true){ 
				pushHistory = 'direct-link';
				aboutFromHistory.current = false;
			}

		}else if(e.target.id === aboutId.current){ //About section
			sectionReducer = e.target.id;
			sectionMenu = e.target.id;

			setActiveOrder(sectionMenu);
      setAboutFocus(sectionMenu);
			newPage = '';

			//Hacky way to capture "click" if triggered by "about direct link" from url, it needs a different History API behaviour
			if(aboutFromHistory.current === true){
				//can be 2 if there's prior lang change
				pushHistory = 'direct-link';
				aboutFromHistory.current = false;
			}

		}else{ // The rest
			sectionReducer = e.target.id;
			sectionMenu = e.target.id;

			setActiveOrder(sectionMenu);
			setMenuItemBeforeAbout(sectionMenu);
      setCurrentPage(1);
      setAboutFocus('');
      newPage = '';
		}

		dispatchNodes({
			type: sectionReducer
		});

		const sectionUrlName = changeHTMLTitle(language, data, sectionMenu, aboutId.current, newPage, totalNodes.current, paginationUserConfig.current.nodesPerPage, setLastSectionPrettyName, setLastSectionUrlName);
		pushBrowserHistory(pushHistory, language, sectionUrlName, newPage, data.langDefault);
	}


	/*---------------------*/
	//  Lang Menu Handler  //
	/*---------------------*/
	const handlerLang = (e) => {
		e.preventDefault();

		const langString = e.target.getAttribute("lang");
		setLanguage(langString);
		localStorage.setItem('language', langString);

		const sectionUrlName = changeHTMLTitle(langString, data, activeOrder, aboutId.current, currentPage, totalNodes.current, paginationUserConfig.current.nodesPerPage, setLastSectionPrettyName, setLastSectionUrlName );
		pushBrowserHistory(false, langString, sectionUrlName, currentPage, data.langDefault)				
	}

	return(
		<>
			<div className="wrapper" ref={wrapper}>
				<header>
					<Header data={data} language={language} handlerLang={handlerLang} menuItemBeforeAbout={menuItemBeforeAbout} handlerMenu={handlerMenu}></Header>
				</header>

				<main>
					{(totalNodes.current === 0) ? (
						<div className="loading-spinner">
							<p className="sr-only">{data.loading[language]}</p>
								<div className="spinner-wrapper">
									<svg className="spinner" viewBox="25 25 50 50">
							      <circle className="spinner-color" cx="50" cy="50" r="20" fill="none" strokeWidth="3" strokeMiterlimit="10" />				
							    </svg>
							  </div>  
						</div>
					)	: (
						<LeveNodesContainer nodes={leveNodesData.reordered} paginationUserConfig={paginationUserConfig.current} totalNodes={totalNodes.current} lang={language} lastSectionPrettyName={lastSectionPrettyName} lastSectionUrlName={lastSectionUrlName} currentPage={currentPage} setCurrentPage={setCurrentPage} pageOf={data.pageOf[language]} sectionTitleEl={sectionTitleEl} rendersCounter={rendersCounter} aboutFocus={aboutFocus} setAboutFocus={setAboutFocus} aboutCallback={aboutCallback} langDefault={data.langDefault} changeHTMLTitle={changeHTMLTitle} pushBrowserHistory={pushBrowserHistory} data={data} activeOrder={activeOrder} aboutId={aboutId} setLastSectionPrettyName={setLastSectionPrettyName} setLastSectionUrlName={setLastSectionUrlName} />
					)}
				</main>
			</div>	
			<About aboutId={aboutId.current} language={language} activeOrder={activeOrder} wrapper={wrapper} handlerMenu={handlerMenu} aboutFocus={aboutFocus} setAboutFocus={setAboutFocus} aboutCallback={aboutCallback} />
		</>
		)
}


Autoportrait.propTypes = {
	data : PropTypes.shape({
		title : PropTypes.shape({
			en : PropTypes.string.isRequired,
			es : PropTypes.string.isRequired,
		}),
		author : PropTypes.shape({
			en : PropTypes.string.isRequired,
			es : PropTypes.string.isRequired,
		}),
		desc : PropTypes.shape({
			en : PropTypes.string.isRequired,
			es : PropTypes.string.isRequired,
		}),
		menu : PropTypes.arrayOf(
			PropTypes.shape({
				id : PropTypes.string.isRequired,
				en : PropTypes.shape({
					name: PropTypes.string.isRequired,
					url: PropTypes.string.isRequired
				}),
				es : PropTypes.shape({
					name: PropTypes.string.isRequired,
					url: PropTypes.string.isRequired
				})
			})
		),
		language : PropTypes.shape({
			en : PropTypes.string.isRequired,
			es : PropTypes.string.isRequired,
		}),
		titleBy : PropTypes.shape({
			en : PropTypes.string.isRequired,
			es : PropTypes.string.isRequired,
		}),
		pageOf : PropTypes.shape({
			en : PropTypes.string.isRequired,
			es : PropTypes.string.isRequired,
		}),
		langDefault : PropTypes.string.isRequired
	})
}

Header.propTypes = {
	data : PropTypes.object.isRequired,
	language : PropTypes.string.isRequired,
	handlerLang : PropTypes.func.isRequired,
	menuItemBeforeAbout : PropTypes.string.isRequired,
	handlerMenu : PropTypes.func.isRequired,
}

LeveNodesContainer.propTypes = {
	nodes : PropTypes.array.isRequired,
	paginationUserConfig : PropTypes.shape({
		firstPage : PropTypes.number.isRequired,
		nodesPerPage : PropTypes.number.isRequired, 
		maxNumsInNav : PropTypes.number.isRequired 
	}),
	totalNodes : PropTypes.number.isRequired,
	currentPage : PropTypes.number.isRequired,
	lang : PropTypes.string.isRequired,
	lastSectionPrettyName : PropTypes.string.isRequired,
	lastSectionUrlName : PropTypes.string.isRequired,
	aboutFocus : PropTypes.string.isRequired,
	setAboutFocus : PropTypes.func.isRequired,
	langDefault : PropTypes.string.isRequired
}

About.propTypes = {
	language : PropTypes.string.isRequired,
	activeOrder : PropTypes.string.isRequired,
	wrapper : PropTypes.object.isRequired,
	handlerMenu : PropTypes.func.isRequired, 
	aboutFocus : PropTypes.string.isRequired
}

ReactDOM.render(
	<Autoportrait data={homeData} />,
	document.getElementById('root')
);