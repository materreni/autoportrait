import React from 'react';


function PaginationItem({ item, currentPage, handlerCurrentPage, paginationText, lang, lastSectionUrlName, langDefault}){

	const langUrl = (langDefault === lang) ? '' : `/${lang}`;

	if(!item.label){ //regular page number
		return(
			<li className={(currentPage === item.pageNum) ? "pagination-current" : null}>
				<a href={`${langUrl}/${lastSectionUrlName}/${item.url}`} id={item.pageNum} onClick={handlerCurrentPage} aria-current={(currentPage === item.pageNum) ? "page" : null}><span className="sr-only">{paginationText.pageBtn[lang]} </span>{(String(item.pageNum).length > 1) ? item.pageNum : `0${item.pageNum}` }</a>
			</li>
		)
	}else if(item.css === 'skiped-pages'){ //ellipses
		return(
			<li className={item.css}>
				<span role="img" aria-label={paginationText.ellipsesAria[lang]} className="sr-only">{item.label}</span>
			</li>
		)
	}else{ //prev/next arrows with/without links
		return(
			<li className={item.css}>
				{(item.url) ? ( //active next/prev button
					<a href={`${langUrl}/${lastSectionUrlName}/${item.url}`} data-page={item.pagenum} onClick={handlerCurrentPage}>
						{(item.css === 'prev-arrow') ? ( 
							<svg xmlns="http://www.w3.org/2000/svg" width="62" height="14" viewBox="0 0 62 14">
								<path d="M 6.0890459,13.655719 0.34139071,7.903634 C 0.23200138,7.7941963 0.14524431,7.6630597 0.0867776,7.5262625 -0.03179797,7.2318369 -0.02874556,6.9023693 0.09526471,6.6101932 0.15750347,6.4639617 0.24614655,6.3309383 0.3564789,6.2186702 L 6.2125805,0.35997748 C 6.6738417,-0.11510287 7.4328791,-0.12566729 7.9071722,0.33639176 8.3692478,0.79867187 8.3645328,1.558132 7.891141,2.0317333 L 4.1002346,5.824317 4.0776024,8.2215695 7.7996688,11.945283 c 0.4620757,0.464167 0.4573607,1.22174 -0.016031,1.695341 -0.4733918,0.473602 -1.231573,0.479262 -1.6945918,0.01604 z" fill="#000" />
								<rect width="58" height="2.4" x="4" y="5.7" fill="#000" />
							</svg>
						):(
							<svg xmlns="http://www.w3.org/2000/svg" width="62" height="14" viewBox="0 0 62 14">
								<path d="m 55.93304,0.3441982 5.747656,5.7507047 c 0.109389,0.1094114 0.196146,0.2405166 0.254613,0.377281 0.118575,0.2943549 0.115523,0.6237434 -0.0085,0.9158494 -0.06224,0.1461965 -0.150882,0.2791879 -0.261215,0.3914291 l -5.856101,5.8572866 c -0.461261,0.474967 -1.220299,0.485529 -1.694592,0.02359 -0.462076,-0.46217 -0.457361,-1.221447 0.01603,-1.694935 l 3.790907,-3.791678 0.02263,-2.3966773 -3.722067,-3.72282 c -0.462075,-0.4640556 -0.45736,-1.22144672 0.01603,-1.69493412 0.473392,-0.47348836 1.231573,-0.479147 1.694592,-0.0160361 z" fill="#000" />
								<rect width="58" height="2.4" x="0" y="5.7" fill="#000" />
							</svg>
						)}
						<span className="sr-only">{item.label}</span>
					</a>
				):( //non-active next/prev button
					(item.css === 'prev-arrow') ? ( 
						<>
							<svg xmlns="http://www.w3.org/2000/svg" width="62" height="14" viewBox="0 0 62 14">
								<path d="M 6.0890459,13.655719 0.34139071,7.903634 C 0.23200138,7.7941963 0.14524431,7.6630597 0.0867776,7.5262625 -0.03179797,7.2318369 -0.02874556,6.9023693 0.09526471,6.6101932 0.15750347,6.4639617 0.24614655,6.3309383 0.3564789,6.2186702 L 6.2125805,0.35997748 C 6.6738417,-0.11510287 7.4328791,-0.12566729 7.9071722,0.33639176 8.3692478,0.79867187 8.3645328,1.558132 7.891141,2.0317333 L 4.1002346,5.824317 4.0776024,8.2215695 7.7996688,11.945283 c 0.4620757,0.464167 0.4573607,1.22174 -0.016031,1.695341 -0.4733918,0.473602 -1.231573,0.479262 -1.6945918,0.01604 z" fill="#000" />
								<rect width="58" height="2.4" x="4" y="5.7" fill="#000" />
							</svg>					
						</>
					):(
						<>
							<svg xmlns="http://www.w3.org/2000/svg" width="62" height="14" viewBox="0 0 62 14">
								<path d="m 55.93304,0.3441982 5.747656,5.7507047 c 0.109389,0.1094114 0.196146,0.2405166 0.254613,0.377281 0.118575,0.2943549 0.115523,0.6237434 -0.0085,0.9158494 -0.06224,0.1461965 -0.150882,0.2791879 -0.261215,0.3914291 l -5.856101,5.8572866 c -0.461261,0.474967 -1.220299,0.485529 -1.694592,0.02359 -0.462076,-0.46217 -0.457361,-1.221447 0.01603,-1.694935 l 3.790907,-3.791678 0.02263,-2.3966773 -3.722067,-3.72282 c -0.462075,-0.4640556 -0.45736,-1.22144672 0.01603,-1.69493412 0.473392,-0.47348836 1.231573,-0.479147 1.694592,-0.0160361 z" fill="#000" />
								<rect width="58" height="2.4" x="0" y="5.7" fill="#000" />
							</svg>
						</>	
					)		
				)}
			</li>
		)
	}

}

export default PaginationItem;