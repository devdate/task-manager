const Highlighter = ({ fullText, searchText }: { fullText: string; searchText: string }) => {
  return (
    <>
      {searchText && fullText.indexOf(searchText) > -1 ? (
        <>
          {fullText.slice(0, fullText.indexOf(searchText))}
          <span style={{ backgroundColor: "yellow" }}>{searchText}</span>
          {fullText.slice(fullText.indexOf(searchText) + searchText.length, fullText.length)}
        </>
      ) : (
        fullText
      )}
    </>
  );
};

export default Highlighter;
