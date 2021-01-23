import React from 'react';

const footnoteAria = {
	open : {
		en : 'Show footnote',
		es : 'Mostrar nota al pie'
	},
	close : {
		en : 'Close footnote',
		es : 'Cerrar nota al pie'
	}
}

function LeveNodeText({ children, lang, liked, footnote, ftnoteNum}){

	function toggleFootnote(e){
		e.preventDefault();
		let ftnoteContainer = e.target;

		//toggleFootnote is used by elems in diff DOM tree levels
		while(ftnoteContainer.localName !== 'li'){
			ftnoteContainer = ftnoteContainer.parentNode;
		}

		const ftnoteNumber = ftnoteContainer.querySelector('.footnote-number');
		const ftnoteClose = ftnoteContainer.querySelector('.footnote-close');
		const ftnoteText = ftnoteClose.previousElementSibling;

		const keyBoardClose = { escape : 
			(event) => {
			if (event.key === 'Escape') { 
		    ftnoteContainer.classList.remove('footnote-expanded');
		    document.removeEventListener('keyup', keyBoardClose.escape);
		    ftnoteNumber.focus();
		  	}
			}
		}

		if(!ftnoteContainer.classList.contains('footnote-expanded')){
			ftnoteContainer.classList.add('footnote-expanded');
			ftnoteNumber.setAttribute('aria-expanded', 'true');
			
			//focus text to mimic aria-labelledby with internationalization
			ftnoteText.focus();
			const ftnoteTimer = window.setTimeout( function() {
				ftnoteClose.focus();
				clearTimeout(ftnoteTimer);
			}, 1000);

			document.addEventListener('keyup', keyBoardClose.escape);
		}else{ 
			ftnoteContainer.classList.remove('footnote-expanded');
			ftnoteNumber.setAttribute('aria-expanded', 'false');
			ftnoteNumber.focus();
		}

	};

	return(
		<>
		{(liked !== null) ? (
			(footnote && lang === "es") ? (
				<p className="node-text">
					<span className="underline">
						<span dangerouslySetInnerHTML={{ __html: children }}></span>
						&nbsp;
						<a href={`#nota-${ftnoteNum}`} aria-label={`${footnoteAria.open[lang]} ${ftnoteNum}`} className="footnote-number" onClick={toggleFootnote} aria-controls={`nota-${ftnoteNum}`} aria-expanded="false">
							[{ftnoteNum}]
						</a>
						<span className="footnote-text" id={`nota-${ftnoteNum}`}>
							<span tabIndex="-1" dangerouslySetInnerHTML={{ __html: footnote }}></span>
							&nbsp;
							<button className="footnote-close" aria-label={footnoteAria.close[lang]} onClick={toggleFootnote} aria-controls={`nota-${ftnoteNum}`} aria-expanded="true"></button>
						</span>
					</span>
				</p>
			)	:	(
				<p className="node-text">
					<span className="underline" dangerouslySetInnerHTML={{ __html: children }}>
					</span>
				</p>	
			)	
		) : (
			(footnote && lang === "es") ? (
				<p className="node-text">
					<span dangerouslySetInnerHTML={{ __html: children }}></span>
					&nbsp;
					<a href={`#nota-${ftnoteNum}`} aria-label={`${footnoteAria.open[lang]} ${ftnoteNum}`} className="footnote-number" onClick={toggleFootnote} aria-controls={`nota-${ftnoteNum}`} aria-expanded="false">
						[{ftnoteNum}]
					</a>
					<span className="footnote-text" id={`nota-${ftnoteNum}`}>
						<span tabIndex="-1" dangerouslySetInnerHTML={{ __html: footnote }}></span>
						&nbsp;
						<button className="footnote-close" aria-label={footnoteAria.close[lang]} onClick={toggleFootnote} aria-controls={`nota-${ftnoteNum}`} aria-expanded="true"></button>
					</span>
				</p>
			)	:	(
				<p className="node-text" dangerouslySetInnerHTML={{ __html: children }}></p>	
			)	
		)}
		</>
	)

}

export default LeveNodeText;