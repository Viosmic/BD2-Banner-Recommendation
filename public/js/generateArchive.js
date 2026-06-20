let timeLeftUpdateInterval = null;
const timeLeftArray = [];


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createCostumeList( characters, bannerRec ) {
  const costumeList = [];

  for ( const charName of Object.keys( characters ) ) {
    const charInfo = characters[ charName ];

    for ( const costumeInfo of charInfo.costumes ) {
      const imgNameOptions = [
        costumeInfo.name.toLowerCase(),
        `${ costumeInfo.name.toLowerCase() }_${ charName.toLowerCase() }`
      ];
      let imgName = imgNameOptions.find( name => bannerRec[ name ] ?? '' );
      let rec = bannerRec[ imgName ] || null;

      const costumeData = {
        id: costumeInfo.id,
        charName: charName.replaceAll( '_', ' ' ),
        costumeName: costumeInfo.name.replaceAll( '_', ' ' ),
        dmgAtt: charInfo.dmgAtt,
        rec: rec || null,
        imgName: imgName
      };

      costumeList.push( costumeData );
    }

  }

  return costumeList;
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createCostumeRecCards( costumeList, damageAttributes ) {
  /** @type { HTMLDivElement } */
  const container = document.getElementById( 'main-container' );

  /** @type { HTMLTemplateElement } */
  const template = document.getElementById( 'costumeCard' );

  const modesArray = [ 'gr', 'fh', 'ln', 'tos', 'mw', 'gc', 'gen' ];

  for ( const costume of costumeList ) {
    const costumeCard = template.content.cloneNode( true );

    const id = costume.id;
    const rec = costume.rec;
    if ( !rec ) {
      continue;
    }

    const section = costumeCard.querySelector( '[ data-char-banner-card ]' );
    section.setAttribute( 'id', id );
    section.removeAttribute( 'data-char-banner-card' );

    //Tabs
    const basicTab = costumeCard.querySelector( '[ data-basic-tab ]' );
    basicTab.dataset.bsTarget = `#basic_${ id }`;
    basicTab.removeAttribute( 'data-basic-tab' );
    const basicTabContent = costumeCard.querySelector( '#basic' );
    basicTabContent.id = `basic_${ id }`;

    const pacTab = costumeCard.querySelector( '[ data-pac-tab ]' );
    pacTab.dataset.bsTarget = `#pac_${ id }`;
    pacTab.removeAttribute( 'data-pac-tab' );
    const pacTabContent = costumeCard.querySelector( '#pac' );
    pacTabContent.id = `pac_${ id }`;

    const modeTab = costumeCard.querySelector( '[ data-mode-tab ]' );
    modeTab.dataset.bsTarget = `#mode_${ id }`;
    modeTab.removeAttribute( 'data-mode-tab' );
    const modeTabContent = costumeCard.querySelector( '#mode' );
    modeTabContent.id = `mode_${ id }`;

    //Basic Info
    const costumeImgAvif = costumeCard.querySelector( '[ data-costume-image-avif ]' );
    costumeImgAvif.srcset = `./public/images/avif/costumes/${ costume.imgName || 'nightmare_bunny' }.avif`;
    costumeImgAvif.removeAttribute( 'data-costume-image-avif' );
    /** @type { HTMLImageElement } */
    const costumeImg = costumeCard.querySelector( '[ data-costume-image ]' );
    costumeImg.src = `./public/images/costumes/${ costume.imgName || 'nightmare_bunny' }.png`;
    costumeImg.alt = costume.imgName;
    costumeImg.title = costume.costumeName;
    costumeImg.removeAttribute( 'data-costume-image' );

    const cardTitle = costumeCard.querySelector( '[ data-banner-name ]' );
    const title = document.createElement( 'h1' );
    title.textContent = `${ costume.costumeName } ${ costume.charName }`;
    cardTitle.appendChild( title );
    cardTitle.classList.remove( 'data-banner-name' );

    const roleLine = costumeCard.querySelector( '[ data-role ]' );
    const roleText = document.createTextNode( rec.role );
    roleLine.appendChild( roleText );
    roleLine.classList.remove( 'data-role' );

    const dmgAtt = damageAttributes[ costume.dmgAtt ];

    const propertyImg = costumeCard.querySelector( '[ data-property ]' );
    if ( dmgAtt.element ) {
      propertyImg.src = `./public/images/${ dmgAtt.element }.png`;
      propertyImg.alt = dmgAtt.element;
      propertyImg.title = propertyImg.alt;
    }
    propertyImg.classList.remove( 'data-property' );

    const dmgTypeLine = costumeCard.querySelector( '[ data-dmg-type ]' );
    if ( dmgAtt.dmgType ) {
      const dmgTypeText = document.createTextNode( dmgAtt.dmgType );
      dmgTypeLine.classList.add( `text-${ dmgAtt.dmgType.toLowerCase() }` );
      dmgTypeLine.appendChild( dmgTypeText );
    }
    dmgTypeLine.classList.remove( 'data-dmg-type' );

    const startDate = new Date( Date.parse( rec.startDate ) );
    const endDate = new Date( Date.parse( rec.endDate ) );
    const periodeLine = costumeCard.querySelector( '[ data-banner-periode ]' );
    const periodeText = document.createTextNode( getBannerPeriodeLocalTimeString( startDate, endDate ) );
    periodeLine.appendChild( periodeText );
    periodeLine.classList.remove( 'data-banner-periode' );

    const breakpointsContainer = costumeCard.querySelector( '[ data-breakpoints ]' );
    createBreakpoints( breakpointsContainer, rec.breakpoints );
    breakpointsContainer.classList.remove( 'data-breakpoints' );

    const pullReason = costumeCard.querySelector( '[ data-pull-reason ]' );
    pullReason.innerHTML = rec.pullReason;
    pullReason.classList.remove( 'data-pull-reason' );

    //Pros and Cons
    const pros = costumeCard.querySelector( '[ data-pros ]' );
    addListElements( pros, rec.pros );
    pros.classList.remove( 'data-pros' );

    const cons = costumeCard.querySelector( '[ data-cons ]' );
    addListElements( cons, rec.cons );
    cons.classList.remove( 'data-cons' );

    //Modes
    const costumeModeSuggestions = rec.modes;
    for( const mode of modesArray ) {
      const modeContainer = costumeCard.querySelector( `[ data-${ mode } ]` );
      modeContainer.removeAttribute( `data-${ mode }` );
      const suggestion = costumeModeSuggestions?.[ mode ];
      if ( suggestion || typeof suggestion === 'string'  ) {
        modeContainer.textContent = suggestion;
        continue;
      }
      modeContainer.textContent = String.fromCharCode( 8212 );
    }

    container.appendChild( costumeCard );
  }

  template.remove();
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getBannerPeriodeLocalTimeString( start, end ) {
  return `
    ${ start.toLocaleDateString() } ${ String.fromCharCode( 8212 ) } ${ end.toLocaleDateString() }
  `;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createBreakpoints( container, breakpoints ) {
  for( const [ dupe, comment ] of breakpoints ) {
    const listElement = document.createElement( 'li' );
    listElement.classList.add( 'list-group-item' );

    const picture = document.createElement( 'picture' );
    picture.classList.add( 'pe-2' );

    const source = document.createElement( 'source' );
    source.srcset = `./public/images/avif/${ dupe }.avif`;
    source.type = 'image/avif';

    const dupeImg = document.createElement( 'img' );
    dupeImg.src = `./public/images/${ dupe }.png`;
    const dupeAmount = Number( dupe ) + 1;
    dupeImg.alt = `${ dupeAmount }_dupes.png`;
    dupeImg.title = `Needed Copies: ${ dupeAmount }`;
    dupeImg.loading = 'lazy';
    dupeImg.width = 42;
    dupeImg.height = 35;

    picture.append( source, dupeImg );

    const breakpointComment = document.createElement( 'span' );
    breakpointComment.innerHTML = comment;
    listElement.append( picture, breakpointComment );

    container.appendChild( listElement );
  }
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addListElements( list, dataArray ) {
  if ( dataArray === undefined || dataArray.length === 0 ) {
    const listElement = document.createElement( 'li' );
    listElement.classList.add( 'list-group-item' );
    listElement.textContent = 'Nothing noteworthy!';
    list.appendChild( listElement );
    return;
  }

  for ( const point of dataArray ) {
    const listElement = document.createElement( 'li' );
    listElement.classList.add( 'list-group-item' );
    listElement.textContent = point;
    list.appendChild( listElement );
  }
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function init() {
  const [ characters, archiveData, utilsJson ] = await Promise.all( [
    fetch( './public/json/character_info.json' ).then( res => res.json() ),
    fetch( './public/json/archive_data.json' ).then( res => res.json() ),
    fetch( './public/json/utils.json' ).then( res => res.json() )
  ] );


  const costumeList = createCostumeList( characters, archiveData );

  createCostumeRecCards( costumeList, utilsJson[ 'damageAttributes' ] );
}
init();