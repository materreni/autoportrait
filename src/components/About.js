import React, { useRef, useEffect } from 'react';

const aboutData = {
	title : {
		en : 'A small but thorough ReactJS project by Marcelo Terreni',
		es : 'Un proyecto en ReactJS por Marcelo Terreni'
	},
	text : {
		en : "<p>Everyday, a bot posts a new sentence from the book <cite>Autoportrait</cite> by Edóuard Levé. This project was conceived to explore some real-world solutions to common accessibility challenges when building Single Page Applications: client-side routing, state change notifications, focus management, modal windows, internationalization, semantics, etc.</p> \n <p>Designed and developed using ReactJS, ES6, JSON, CSS (Grid and Flexbox), SVG and HTML5 semantics. The back-end was simulated with a JSON file who schedules each post with a publishing date. Users' likes are kept by local storage variables.</p> \n <p>A detailed tutorial with the solutions I've found is coming soon. Meanwhile, <a href=\"http://www.terreni.com.ar\">check any of the other works in my personal portfolio</a>.</p> \n <p>The data was scraped with a PHP script from the English and Spanish editions of the book:</p> \n <ul> \n <li><cite>Autorretrato</cite> by Édouard Levé (2016), Eterna Cadencia Editora, Buenos Aires. Translation by Matías Battistón.</li> \n <li><cite>Autoportrait</cite> by Édouard Levé (2012), Dalkey Archive Press, London. Translation by Lorin Stein</li> \n <li><cite>Autoportrait</cite> by Édouard Levé (2005), P.O.L éditeur, Paris.</li> \n </ul>",
		es : '<p>Todos los días, una frase nueva del libro <cite>Autorretrato</cite> de Edóuard Levé. Este proyecto busca explorar algunas soluciones posibles para los problemas de accesibilidad más comunes en las Single Page Applications: routing en el cliente, notificaciones de cambio de estado, manejo de focus, ventanas modales, internacionalización, semántica, etc.</p> \n <p>Diseñado y desarrollado con ReactJS, ES6, JSON, CSS (Grid y Flexbox), SVG y semántica HTML5. El back-end fue simulado con un archivo JSON donde cada posteo contiene una propiedad "fecha de publicación". Los likes de los usuarios se guardan mediante variables de Local Storage.</p>	\n <p>En el futuro pienso escribir un tutorial detallado con cada solución a la que llegué. Mientras tanto, <a href="http://www.terreni.com.ar">mirá algún otro de los trabajos en mi portfolio personal</a>.</p> \n <p>Los datos fueron consumidos de las ediciones en inglés y español con un script de PHP:</p> \n <ul> \n	<li><cite>Autorretrato</cite> de Édouard Levé (2016), Eterna Cadencia Editora, Buenos Aires. Traducción de Matías Battistón.</li> \n <li><cite>Autoportrait</cite> de Édouard Levé (2012), Dalkey Archive Press, Londres. Traducción de Lorin Stein</li> \n <li><cite>Autoportrait</cite> de Édouard Levé (2005), P.O.L éditeur, París.</li> \n </ul>'
	},
	ariaClose : {
		en : 'Close window',
		es : 'Cerrar ventana'
	},
	ariaSectionNiceLabel : {
		en : 'About this project',
		es : 'Créditos del proyecto'
	}
};

function About({ language, activeOrder, wrapper, handlerMenu, aboutFocus, setAboutFocus, aboutCallback, aboutId}){
	const aboutEl = useRef();

	useEffect( () => {

		function modalInert(mode){

			const keyBoardClose = { escape : 
			(event) => {
				if (event.key === 'Escape') {
					//clic() not to duplicate parents handlerMenu fucntionality
			    document.getElementsByClassName("about-close")[0].click();
			    document.removeEventListener('keyup', keyBoardClose.escape);
			  	}
				}
			}

			//select focusable elements in wrapper sibling to modal
			const focusableInWpr = wrapper.current.querySelectorAll('a[href], button:not([tabindex]), [data-inerted]');
			if(mode){
				document.body.classList.add('overflowXY');
				aboutEl.current.classList.add("about-display");
				aboutEl.current.setAttribute('aria-modal', 'true');
				//hides modal sibling for Assistive Tech
				wrapper.current.setAttribute('aria-hidden', 'true');
				//remove keyboard focus for focusable elements in Sibling
				for(let i = 0; i < focusableInWpr.length; i++){
					focusableInWpr[i].setAttribute('tabindex', '-1');								
					focusableInWpr[i].dataset.inerted = "true";
					/*data-inert helps ignoring on re-render elements 
					that have tabindex -1 hardcoded and must always keep it */
				}

				const aboutCloseBtn = aboutEl.current.querySelector('.about-close');
				aboutCloseBtn.focus();
				
				document.addEventListener('keyup', keyBoardClose.escape);
			}else{
				aboutEl.current.classList.remove("about-display");
				document.body.classList.remove('overflowXY');
				aboutEl.current.removeAttribute('aria-modal');
				wrapper.current.removeAttribute('aria-hidden');
				for(let i = 0; i < focusableInWpr.length; i++){
					if(focusableInWpr[i].dataset.inerted){
						focusableInWpr[i].removeAttribute('tabindex');
						delete focusableInWpr[i].dataset.inerted;
					}
				}
				if(aboutFocus){
					//shame: anti-pattern but way simplier solution for a secondary accessibility enhacement
					document.getElementById(aboutFocus).focus();
				  aboutCallback.current = true;
					setAboutFocus('');
				}
			}	
		}

		if(activeOrder === aboutId){ 
			modalInert(true);
		}else if(aboutFocus){ // '' used as false
			modalInert(false);
		}

	}, [activeOrder, wrapper, aboutFocus, setAboutFocus, aboutCallback, aboutId]);


	return(
	<>
		<footer ref={aboutEl} className="about" aria-label={aboutData.ariaSectionNiceLabel[language]}>
			<div className="about-wrapper">
				<button className="about-close" onClick={handlerMenu} aria-label={aboutData.ariaClose[language]}></button>
				<div className="about-text">
					<h2>{aboutData.title[language]}</h2>
					<div dangerouslySetInnerHTML={{ __html: aboutData.text[language] }}></div>
				</div>
			</div>
		</footer>
	</>
	)
}


export default About;