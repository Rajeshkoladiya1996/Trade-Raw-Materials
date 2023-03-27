import React from "react";
import "./THDatatable.css";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search,CSVExport } from "react-bootstrap-table2-toolkit";

const THDatatable = (props) => {

  const hadleButtonClick = (e, title) => {
    props.hadleButtonClick(e, title);
  };
  const { SearchBar } = Search;
  const { ExportCSVButton } = CSVExport;
  return (
    <>
      {props.columns.length > 0 && (
        <ToolkitProvider keyField={props.name} data={props.dataList} columns={props.columns} search>
          {(props1) => (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                {props.isButtonVisible && (
                  <button className="table-option-btn" onClick={(e) => hadleButtonClick(e, 'Add Category')}>
                    {props.btnLabelText}
                  </button>
                )}
                <SearchBar {...props1.searchProps} placeholder="Search Orders" className="table-searchbar" />
                {props.isExport ?
                  <ExportCSVButton {...props1.csvProps}><button className="table-option-btn me-3">
                    <i className="ri-download-fill align-bottom"></i> Export
                  </button></ExportCSVButton>
                  : ""}
              </div>
              <div className="table-responsive">
                <BootstrapTable className="themis-table" {...props1.baseProps} bordered={false} pagination={paginationFactory(props.paginationOptions)} /></div>
            </div>
          )}
        </ToolkitProvider>
      )}
    </>
  );
}

export default THDatatable;
