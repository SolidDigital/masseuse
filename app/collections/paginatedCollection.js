/*global define:false*/
define(['backbone', 'underscore'], function (Backbone, _) {
    'use strict';

    /**
     * Paginated Collection
     * make sure you override this empty config with necessary information
     * paginationConfig {
         *      pageSize : '', - results per page
         *      skipPages : '', - number of results to skip
         *      url : '', - endpoint
         *      pageLink : '',- paginated page numbers link, example : '#users/page/'. this automatically concats with
         *      its page number in the fetch success method to create -> '#users/page/3'
         *      showLink : '', - attached on the end of pageLink for the limit attribute in the request
         *      pageLimits : { - used in creating a show # dropdown
         *      start : '',
         *      stop : '',
         *      step : ''
         * }
         */
    return Backbone.Collection.extend({
        paginationConfig : {
            pageSize : '',
            skipPages : '',
            url : '',
            pageLink : '',
            showLink : '',
            pageLimits : {
                start : '',
                stop : '',
                step : ''
            }
        },
        fetch : fetch,
        createPages : createPages,
        createPageSizeDropdownOptions : createPageSizeDropdownOptions,
        calculatePrevOrNextButton : calculatePrevOrNextButton,
        initialize : function () {
            this._paginator = {};
        },
        put : function (prop, value) {
            this._paginator[prop] = value;
        },
        grab : function (prop) {
            return this._paginator[prop];
        }

    });

    function fetch (options) {
        var args = Array.prototype.slice.call(arguments, 0);
        var fetchOptions = {
            data : {},
            headers : {}
        };

        fetchOptions.data = {
            limit : this.paginationConfig.pageSize,
            skip : this.paginationConfig.skipPages
        };

        fetchOptions.success = function (collection, response, options) {

            collection.put('totalResults', response.total);
            collection.put('totalPages', Math.ceil(response.total / collection.paginationConfig.pageSize));
            collection.put('currentPage', (options.data.skip / options.data.limit) + 1);
            collection.put('pages', collection.createPages(options));
            collection.put('dropDownOptions', collection.createPageSizeDropdownOptions());
            collection.put('nextPage', collection.calculatePrevOrNextButton('next'));
            collection.put('prevPage', collection.calculatePrevOrNextButton('prev'));
        };

        if (options) {
            _.extend(fetchOptions.data, options.data, {
                skip : (options.data.page - 1) * this.paginationConfig.pageSize,
                limit : options.data.limit
            });
            _.extend(fetchOptions.headers, options.headers);
            _.extend(fetchOptions.success, options.success);
        }
        args[0] = fetchOptions;
        return Backbone.Collection.prototype.fetch.apply(this, args);
    }

    function createPages (options) {
        var pages = _.range(1, this.grab('totalPages') + 1),
            self = this;

        return _.map(pages, function (page) {
            return {
                page : page,
                current : (page == (options.data.skip / options.data.limit) + 1),
                link : self.paginationConfig.pageLink + page + self.paginationConfig.showLink + options.data.limit
            };
        });
    }

    function createPageSizeDropdownOptions () {
        var self = this,
            options = _.range(
                this.paginationConfig.pageLimits.start,
                this.paginationConfig.pageLimits.stop,
                this.paginationConfig.pageLimits.step
            );

        return _.map(options, function (option) {
            return {
                option : option,
                selected : self.paginationConfig.pageSize == option ? true : false
            };
        });
    }

    function calculatePrevOrNextButton (button) {
        var returnObj = {
            disabled : true,
            link : '',
            onClick : 'return false;'
        };

        if ('prev' == button) {
            if (this.grab('currentPage') > 1) {
                returnObj = {
                    disabled : false,
                    link : this.paginationConfig.pageLink + (this.grab('currentPage') - 1) +
                        this.paginationConfig.showLink + this.paginationConfig.pageSize,
                    onClick : ''
                };
            }
        } else {
            if (this.grab('currentPage') < this.grab('totalPages')) {
                returnObj = {
                    disabled : false,
                    link : this.paginationConfig.pageLink + (this.grab('currentPage') + 1) +
                        this.paginationConfig.showLink + this.paginationConfig.pageSize,
                    onClick : ''
                };
            }
        }

        return returnObj;
    }

});
