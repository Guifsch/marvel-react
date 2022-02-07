import React, { useState, useEffect } from "react";
import "./contentCss/standartMultiSearch.css";
import { series } from "../../api/SeriesSerie";
import { Link } from "react-router-dom";
import ReactLoading from "react-loading";
import Pagination from "@mui/material/Pagination";
import SearchField from "react-search-field";
import ImageNotFound from "../../assets/image_not_available.jpg";
import Drawer from "../../components/utils/Drawer";

const Series = () => {
  const [seriesContent, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageTotal, setPageTotal] = useState(1);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState([]);

  useEffect(() => {
    searchSeries((page - 1) * 20);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    searchSeries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const searchSeries = async (offset) => {
    try {
      setLoading(true);
      const valor = await series(offset, searchValue);
      setSeries(valor.data.data.results);
      const roundPages = Math.round(valor.data.data.total / 20);
      setPageTotal(roundPages);
    } catch (e) {
      console.log(e.response.data.status);
    } finally {
      setLoading(false);
    }
  };
  const handleChangePagination = (e, value) => {
    setPage(value);
  };

  const handleChangeSearch = (value, e) => {
    setSearchValue(value);
  };

  return (
    <div className="standartMultiSearchContent">
      <div className="standartMultiDrawer">
        <Drawer className="standartMultiDrawer" />
      </div>
      {loading ? (
        <ReactLoading
          type={"spokes"}
          color={"black"}
          height={"10%"}
          width={"10%"}
          className="standartLoading"
        />
      ) : (
        false
      )}
      <div className="standartMultiSearchBarContainer">
        <SearchField
          placeholder="Press Enter to search..."
          onEnter={handleChangeSearch}
          classNames="standartMultiSearchBar"
        />
      </div>
      <div className="standartMultiGrid">
        {seriesContent.map((item) => (
          <Link to={`/series/${item.id}`} key={item.id}>
            <div className="standartMultiSearchThumbnailContainer">
              <h1 className="standartMultiSearchTitle">{item.title}</h1>
              <img
                className="standartMultiSearchThumbnail"
                src={item.thumbnail.path + ".jpg"}
                alt=""
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = ImageNotFound;
                }}
              />
            </div>
          </Link>
        ))}
      </div>
      <div className="standartMultiPaginationContainer">
        <Pagination
          className="standartMultiPagination"
          count={pageTotal}
          onChange={handleChangePagination}
          shape="rounded"
        />
      </div>
    </div>
  );
};

export default Series;
