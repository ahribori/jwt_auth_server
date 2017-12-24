import React from 'react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import 'ag-grid/src/styles/ag-grid.scss';
import 'ag-grid/src/styles/ag-theme-material.scss';
import PageWithProfile from '../templates/PageWithProfile';
import needAdmin from '../lib/hoc/needAdmin';

@needAdmin
class AgGridExample extends React.Component {
    onGridReady = (params) => {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;

        this.gridApi.sizeColumnsToFit();
    }


    render() {
        const containerStyle = {
            height: 500,
        };

        const data = [
            { make: 'Toyota', model: 'Celica', price: 35000 },
            { make: 'Ford', model: 'Mondeo', price: 32000 },
            { make: 'Porsche', model: 'Boxter', price: 72000 },
        ];

        return (
            <PageWithProfile {...this.props}>
                <div style={containerStyle} className="ag-theme-material">
                    <AgGridReact
                    // properties
                        rowData={data}

                        // events
                        onGridReady={this.onGridReady}
                    >

                        {/* column definitions */}
                        <AgGridColumn field="make" />
                        <AgGridColumn field="model" />
                        <AgGridColumn field="price" />
                    </AgGridReact>
                </div>
            </PageWithProfile>
        );
    }
}

export default AgGridExample;
