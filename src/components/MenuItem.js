import React from 'react';

function MenuItem({ children, current, lang, menuId, url, handler }){

	return(
		<li className={(current) ? current : null}>
		{lang ? 
			<a href={url} lang={lang} onClick={handler} aria-current={(current) ? "true" : null} dangerouslySetInnerHTML={{ __html: children }}></a>
		 : 
			<a href={`/${url}`} id={menuId} onClick={handler} aria-current={(current) ? "page" : null}>{children}</a>
		}
		</li>
	);
}

export default MenuItem;