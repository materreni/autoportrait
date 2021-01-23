import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import MenuItem from './MenuItem.js';


function Header({ data, language, handlerLang, menuItemBeforeAbout, handlerMenu, topScrollPosition}){
	const menuAriaExpanded = useRef(window.getComputedStyle(document.body, '::after').content.replace(/"/g, '') || "");

	function toggleMenu(e){
		const nav = e.currentTarget.parentNode;
		const navToggle = e.target;
		if(!nav.classList.contains('menu-opened')){
			navToggle.setAttribute('aria-expanded', 'true')
			nav.classList.add('menu-opened');
		}else{
			nav.classList.remove('menu-opened');
			navToggle.setAttribute('aria-expanded', 'false');
		}
	}


	return(
		<>
			<ul className="menu menu-lang">
				<MenuItem lang="en" url="/" current={(language === 'en') ? 'menu-current' : null} handler={handlerLang}>{'En<span class="sr-only">glish</span>'}</MenuItem>
				<MenuItem lang="es" url="/es" current={(language === 'es') ? 'menu-current' : null} handler={handlerLang}>{'Es<span class="sr-only">pañol</span>'}</MenuItem>
			</ul>

			<nav className="menu menu-site">
				<button className="menu-site-toggle" onClick={toggleMenu} aria-expanded={(menuAriaExpanded.current === "expanded") ? null : "false"} aria-controls="menu-site">
					<svg xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="70" height="73" viewBox="0 0 70 73">
						<polygon fill="#2B2B2B" points="70,0 70,73 0,0"/>
						<rect className="cross-vt" x="41" y="25" fill="#FFFFFF" width="13" height="3"/>
						<rect className="cross-hz" x="46" y="20" fill="#FFFFFF" width="3" height="13" />
					</svg>
					Menu
				</button>
				<ul id="menu-site">
					{data.menu.map( item => (
						<MenuItem key={item.id} url={item[language]["url"]} current={(item.id === menuItemBeforeAbout ) ? 'menu-current' : null } menuId={item.id} handler={handlerMenu}>{item[language]["name"]}</MenuItem>
						)
					)}
				</ul>
			</nav>

			<div className="home-intro">
				<h1 className="home-intro-title">{ data.title[language] }</h1>
				<p className="home-intro-author">{ data.author[language] }</p>
				<div className="home-intro-imgs">
					<img src="/img/autoportrait-hero.jpg" alt="" />
					<div className="home-intro-imgs-stamp"></div>
				</div>	
				<p className="home-intro-desc" dangerouslySetInnerHTML={{ __html: data.desc[language]}} />
			</div>

		</>
	)
}

MenuItem.propTypes = {
	url : PropTypes.string.isRequired,
	current : PropTypes.string,
	menuId : PropTypes.string, //only menu-site
	handler : PropTypes.func.isRequired,
	lang : PropTypes.string, //only menu-lang
	children : PropTypes.string.isRequired
}

export default Header;