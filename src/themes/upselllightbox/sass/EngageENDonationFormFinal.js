function EngageENDonationForm(Options)
{
	if (jQuery('#EN__RootElement').length === 0)
	{
		var EngageENDonationForm = this;
		EngageENDonationForm.options = {
			formSelector: 'form.en__component.en__component--page',
			translateArg: function (argName)
			{
				return argName;
			},
			recurLabelRegex: /[\/\s]*month.*$/,
			showRecurInLabels: false,
			recurRadioSelector: '#en__field_transaction_recurrpay1',
			oneTimeRadioSelector: '#en__field_transaction_recurrpay0',
			oneTimeClass: 'recurN',
			recurClass: 'recurY',
			oneTimeDefaultLevel: '50',
			recurDefaultLevel: '20',
			changeLevel: false,
			mobileRowBreak: 0,
			tabletRowBreak: 3,
			desktopRowBreak: 3,
			donColClass: 'col-12 col-md-6',
			otherMinimum: 5,
			otherLevelValue: 'Other',
			cardFeeCheckboxSelector: '',
			cardFeeMultiplier: .05,
			placeHoldersFor: [],
			placeHolderOverrides:
			{},
			useParsley: window.hasOwnProperty('Parsley'),
			excludeParsley: [],
			useCreditCardValidator: jQuery.fn.hasOwnProperty('validateCreditCard'),
			acceptCardTypes:
			{
				accept: ['visa', 'mastercard', 'discover', 'amex']
			},
			translateCardTypes:
			{
				'visa': 'VI',
				'mastercard': 'MC',
				'discover': 'DI',
				'amex': 'AX'
			},
			useCardTypeSelect: true,
			useAutoNumeric: (typeof AutoNumeric !== 'undefined'),
			autoNumericOptions:
			{
				unformatOnSubmit: true,
				digitGroupSeparator: ''
			},
			payTypeSwitchShow:
			{
				frequencies: ['MONTHLY'],
				selector: '.en__field--ach-eft-selection input[type="radio"]'
			},
			payTypeSwitchTypes:
			{
				'ACH': ['#exampleCheck'],
			},
			afterDonationCallbacks:
			{},
			windowSizes:
			{
				mobileMax: 600,
				tabletMin: 599,
				tabletMax: 961,
				desktopMin: 968,
				tallMin: 820
			},
			afterWindowSize: function (options)
			{
				return false;
			},
			currentPageNumber: 1,
			newPageNumber: 0,
			lastPageNumber: 3,
			pageBlock: jQuery('<div/>'),
			pageStartSelector: '.step',
			pageExcludeSelector: '.step-exclude',
			pageItemClass: 'step-item',
			pageItemParentSelector: '.en__component',
			pageIDPrefix: 'step',
			breadcrumbs: jQuery('<div class="row"></div>'),
			breadcrumbItemMobile: jQuery('<div class="row"></div>').append('<div class="col-2 previous">&nbsp;</div>').append('<div class="col title" />').append('<div class="col-2 next">&nbsp;</div>'),
			breadcrumbItemTablet: jQuery('<div class="col title"></div>'),
			breadcrumbItemDesktop: jQuery('<div class="col title"></div>'),
			showLevel: jQuery('<span class="amount"></span>'),
			showLevelFormat:
			{
				'ONE-TIME': '$%%amount%%',
				'MONTHLY': '$%%amount%% a month',
				'ANNUAL': '$%%amount%% annually'
			},
			pageButtons: jQuery('<div class="step-nav row"/>'),
			pageButtonColumn: jQuery('<div class="col-12 col-md-6" />'),
			backButton: jQuery('<button class="step-back">Back</button>'),
			continueButton: jQuery('<button class="step-next">Continue</button>'),
			pageCallbacks:
			{
				'1':
				{
					beforeShow: function (pageNumber, pageObject)
					{
						if (console)
						{
							console.log('beforeLoad default\n' +
								'pageNumber = ' + pageNumber + '\n' +
								'pageObject = ' + jQuery(pageObject).class + '\n');
						}
						return true;
					},
					beforeHide: function (pageNumber, pageObject)
					{
						if (console)
						{
							console.log('beforeHide default\n' +
								'pageNumber = ' + pageNumber + '\n' +
								'pageObject = ' + jQuery(pageObject).prop('nodeName') + '\n' +
								'   ID      = ' + jQuery(pageObject).attr('id') + '\n' +
								'   class      = ' + jQuery(pageObject).attr('class') + '\n');
						}
						return true;
					},
				},
			},
			formErrorClass: 'form-has-errors',
			sectionErrorClass: 'error',
			afterLoad: function ()
			{
				return false;
			}
		};
		jQuery.extend(EngageENDonationForm.options, Options);
		jQuery(document).ready(function ()
		{
			if (jQuery('form .en__submit').length === 0)
			{
				if (console)
				{
					console.log("EngageEnDonationForm: Won't run on confirmation or thank you page.");
				}
				return false;
			}
			if (typeof TEGCustom !== 'undefined')
			{
				jQuery.extend(EngageENDonationForm.options, TEGCustom);
			}
			EngageENDonationForm.form = jQuery(EngageENDonationForm.options.formSelector).hide();
			if (EngageENDonationForm.form.length > 0)
			{
				EngageENDonationForm.document = jQuery(document);
				EngageENDonationForm.body = EngageENDonationForm.document.find('body');
				EngageENDonationForm.fields = EngageENDonationForm.document.find('input').add('select').add('textarea');
				EngageENDonationForm.args = {};
				window.location.search.slice(1).split("&").forEach(function (arg)
				{
					if (arg)
					{
						var nv = arg.split("="),
							argName = EngageENDonationForm.options.translateArg(decodeURIComponent(nv[0]));
						if (nv[1])
						{
							EngageENDonationForm.args[argName] = decodeURIComponent(nv[1].replace(/</g, ""));
						}
					}
				});
				EngageENDonationForm.windowSize = function ()
				{
					jQuery.extend(EngageENDonationForm.options.windowSizes,
					{
						isMobile: (window.innerWidth < EngageENDonationForm.options.windowSizes.mobileMax),
						isTablet: (window.innerWidth > EngageENDonationForm.options.windowSizes.tabletMin && window.innerWidth < EngageENDonationForm.options.windowSizes.tabletMax),
						isDesktop: (window.innerWidth > EngageENDonationForm.options.windowSizes.desktopMin),
						isTall: (window.innerHeight > EngageENDonationForm.options.windowSizes.tallMin)
					});
					EngageENDonationForm.options.afterWindowSize(EngageENDonationForm.options);
				};
				jQuery(window).resize(jQuery.throttle(200, EngageENDonationForm.windowSize));
				EngageENDonationForm.windowSize();
				EngageENDonationForm.preloadImages = function ()
				{
					for (var offset in arguments)
					{
						jQuery('<img />').prop('src', arguments[offset]);
					}
				};
				if (console)
				{
					console.log('EngageENDonationForm: Loading and juggling donation levels.');
				}
				EngageENDonationForm.recurPay = EngageENDonationForm.fields.filter('[name="transaction.recurrpay"]');
				EngageENDonationForm.recurRadio = EngageENDonationForm.fields.filter(EngageENDonationForm.options.recurRadioSelector);
				EngageENDonationForm.oneTimeRadio = EngageENDonationForm.fields.filter(EngageENDonationForm.options.oneTimeRadioSelector);
				EngageENDonationForm.recurFrequency = EngageENDonationForm.fields.filter('[name="transaction.recurrfreq"]');
				EngageENDonationForm.recurDay = EngageENDonationForm.fields.filter('[name="transaction.recurrday"]');
				EngageENDonationForm.cardFeeCheckbox = EngageENDonationForm.fields.filter(EngageENDonationForm.options.cardFeeCheckboxSelector);
				if (EngageENDonationForm.options.showLevel.length > 0)
				{
					EngageENDonationForm.showLevel = EngageENDonationForm.options.showLevel;
					jQuery.extend(EngageENDonationForm.showLevel,
					{
						set: function ()
						{
							var thisDisplay = jQuery(this),
								currentDonation = EngageENDonationForm.calcDonation(),
								frequency = currentDonation[EngageENDonationForm.CD_FREQUENCY],
								amount = currentDonation[EngageENDonationForm.CD_ISCARDFEE] ? currentDonation[EngageENDonationForm.CD_AMOUNT] + currentDonation[EngageENDonationForm.CD_CARDFEEAMOUNT] : currentDonation[EngageENDonationForm.CD_AMOUNT];
							if (amount % 1 > 0)
							{
								amount = amount.toFixed(2);
							}
							thisDisplay.text(EngageENDonationForm.options.showLevelFormat[frequency].replace('%%amount%%', amount));
							return thisDisplay;
						},
						clear: function ()
						{
							return jQuery(this).text('');
						}
					});
					jQuery.extend(EngageENDonationForm.options.afterDonationCallbacks,
					{
						'99999_showLevel': function ()
						{
							EngageENDonationForm.showLevel.set();
						}
					});
				}
				else
				{
					EngageENDonationForm.showLevel = [];
				}
				EngageENDonationForm.CD_AMOUNT = 0;
				EngageENDonationForm.CD_FREQUENCY = 1;
				EngageENDonationForm.CD_CARDFEEAMOUNT = 2;
				EngageENDonationForm.CD_ISCARDFEE = 3;
				EngageENDonationForm.donationLevels = EngageENDonationForm.fields.filter('.en__field--donationAmt input[type="radio"]');
				EngageENDonationForm.calcDonation = function ()
				{
					var selectedLevel = EngageENDonationForm.donationLevels.filter(':checked'),
						amount = 0,
						frequency = EngageENDonationForm.recurPay.filter(':checked').val() === 'Y' ? EngageENDonationForm.fields.filter('[name="transaction.recurrfreq"]').val() : 'ONE-TIME',
						feeToAdd = 0,
						isCardFee = EngageENDonationForm.cardFeeCheckbox.is(':checked');
					if (selectedLevel.length > 0)
					{
						if (selectedLevel.val() === 'Other')
						{
							amount = EngageENDonationForm.otherLevel.input.get();
						}
						else
						{
							amount = +selectedLevel.val().replace(/[$, ]g/, '');
						}
					}
					if (isCardFee)
					{
						feeToAdd = +amount * EngageENDonationForm.options.cardFeeMultiplier;
					}
					return [amount, frequency, feeToAdd, isCardFee];
				};
				EngageENDonationForm.setDonLevel = function (amount, isRecurring)
				{
					if (!EngageENDonationForm.donationLevels.filter('[value="' + amount + '"][data-recurring="' + isRecurring + '"]').click().length > 0)
					{
						EngageENDonationForm.otherLevel.radio.click();
						EngageENDonationForm.otherLevel.input.set(amount);
					}
				}
				jQuery.extend(EngageENDonationForm.options.afterDonationCallbacks,
				{
					'00100_ChangeRecurring': function (event)
					{
						var target = jQuery(event.target),
							currentDonation = EngageENDonationForm.calcDonation(),
							frequency = currentDonation[EngageENDonationForm.CD_FREQUENCY],
							amount = currentDonation[EngageENDonationForm.CD_AMOUNT];
						if (console)
						{
							console.log('00100_ChangeRecurring\n' +
								'event.target = ' + event.target + '\n');
						}
						if (target.attr('name') === 'transaction.recurrpay')
						{
							var isOneTime = (frequency === 'ONE-TIME');
							if (console)
							{
								console.log('isOneTime = ' + isOneTime + '\n' +
									'amount = ' + amount + '\n' +
									'event.currentTarget.id = ' + event.currentTarget.id + '\n');
							}
							if (isOneTime)
							{
								if (EngageENDonationForm.options.changeLevel)
								{
									amount = EngageENDonationForm.options.oneTimeDefaultLevel;
								}
							}
							else
							{
								if (EngageENDonationForm.options.changeLevel)
								{
									amount = EngageENDonationForm.options.recurDefaultLevel;
								}
							}
							EngageENDonationForm.body.toggleClass(EngageENDonationForm.options.oneTimeClass, isOneTime).toggleClass(EngageENDonationForm.options.recurClass, !isOneTime);
							EngageENDonationForm.setDonLevel(amount, !isOneTime);
						}
					}
				});
				EngageENDonationForm.fireAfterDonationCallbacks = function (event)
				{
					if (console)
					{
						console.log('fireAfterDonationCallbacks\n' +
							'event.currentTarget.id = ' + event.currentTarget.id + '\n');
					}
					var keys = Object.keys(EngageENDonationForm.options.afterDonationCallbacks).sort();
					for (var counter = 0; counter < keys.length; counter++)
					{
						var thisKey = keys[counter];
						if (EngageENDonationForm.options.afterDonationCallbacks.hasOwnProperty(thisKey) && typeof EngageENDonationForm.options.afterDonationCallbacks[thisKey] === 'function')
						{
							if (console)
							{
								console.log('fireAfterDoantionCallbacks Loop\n' +
									'thisKey = ' + thisKey + '\n');
							}
							EngageENDonationForm.options.afterDonationCallbacks[thisKey](event);
						}
					}
				};
				EngageENDonationForm.donationLevels.change(EngageENDonationForm.fireAfterDonationCallbacks);
				EngageENDonationForm.recurRadio.change(EngageENDonationForm.fireAfterDonationCallbacks);
				EngageENDonationForm.oneTimeRadio.change(EngageENDonationForm.fireAfterDonationCallbacks);
				EngageENDonationForm.recurFrequency.change(EngageENDonationForm.fireAfterDonationCallbacks);
				EngageENDonationForm.recurDay.change(EngageENDonationForm.fireAfterDonationCallbacks);
				EngageENDonationForm.cardFeeCheckbox.change(EngageENDonationForm.fireAfterDonationCallbacks);
				EngageENDonationForm.otherLevel = {
					radio: EngageENDonationForm.donationLevels.filter('[value="' +
						EngageENDonationForm.options.otherLevelValue +
						'"]'),
					input: EngageENDonationForm.fields.filter('.en__field__input--other')
				};
				EngageENDonationForm.otherLevel.radio.change(function (event)
				{
					if (console)
					{
						console.log('otherLevel.radio.change\n' +
							'event.currentTarget.id = ' + event.currentTarget.id + '\n');
					}
					EngageENDonationForm.otherLevel.input.focus();
				});
				EngageENDonationForm.otherLevel.input.change(function (event)
				{
					if (console)
					{
						console.log('otherLevel.input.change\n' +
							'event.currentTarget.id = ' + event.currentTarget.id + '\n');
					}
					EngageENDonationForm.fireAfterDonationCallbacks(event);
				}).keyup(function (event)
				{
					if (console)
					{
						console.log('otherLevel.input.keyup\n' +
							'event.currentTarget.id = ' + event.currentTarget.id + '\n');
					}
					if (EngageENDonationForm.showLevel.length > 0)
					{
						EngageENDonationForm.showLevel.set();
					}
				});
				if (EngageENDonationForm.options.useAutoNumeric)
				{
					EngageENDonationForm.otherLevel.input.autoNumeric = new AutoNumeric('.en__field--donationAmt .en__field__input--other', EngageENDonationForm.options.autoNumericOptions);
				}
				EngageENDonationForm.otherLevel.input.get = function ()
				{
					if (EngageENDonationForm.options.useAutoNumeric)
					{
						return +EngageENDonationForm.otherLevel.input.autoNumeric.getNumericString();
					}
					else
					{
						return +EngageENDonationForm.otherLevel.input.val().replace(/[$, ]/g, '');
					}
				};
				EngageENDonationForm.otherLevel.input.set = function (value)
				{
					EngageENDonationForm.otherLevel.radio.prop('checked', true);
					if (EngageENDonationForm.options.useAutoNumeric)
					{
						EngageENDonationForm.otherLevel.input.autoNumeric.set(value);
						return EngageENDonationForm.otherLevel.input;
					}
					else
					{
						return EngageENDonationForm.otherLevel.input.val(value);
					}
				};
				if (EngageENDonationForm.cardFeeCheckbox.is(':checked'))
				{
					var donation = EngageENDonationForm.calcDonation(),
						amount = donation[EngageENDonationForm.CD_AMOUNT],
						recurring = donation[EngageENDonationForm.CD_FREQUENCY] !== 'ONE-TIME';
					EngageENDonationForm.setDonLevel(amount / (1 + EngageENDonationForm.options.cardFeeMultiplier), recurring);
				}
				var donRowBreak = 0;
				if (EngageENDonationForm.options.windowSizes.isMobile)
				{
					donRowBreak = EngageENDonationForm.options.mobileRowBreak;
				}
				else if (EngageENDonationForm.options.windowSizes.isTablet)
				{
					donRowBreak = EngageENDonationForm.options.tabletRowBreak;
				}
				else
				{
					donRowBreak = EngageENDonationForm.options.desktopRowBreak;
				}
				if (donRowBreak > 0)
				{
					var donRow = jQuery('<div class="row"></div>'),
						theseCells = jQuery();
				}
				EngageENDonationForm.donationLevels.each(function (index)
				{
					var thisRadio = jQuery(this),
						thisLabel = jQuery('label[for="' + thisRadio.prop('id') + '"]'),
						thisText = thisLabel.text().replace(/[\n]/g, ''),
						isRecurring = EngageENDonationForm.options.recurLabelRegex.test(thisText),
						container = thisRadio.parents('.en__field__item');
					thisRadio.attr('data-recurring', isRecurring);
					if (!EngageENDonationForm.options.showRecurInLabels)
					{
						thisLabel.text(thisText.replace(EngageENDonationForm.options.recurLabelRegex, ''));
					}
					if (thisRadio.val() !== EngageENDonationForm.options.otherLevelValue)
					{
						container.addClass(EngageENDonationForm.options.donColClass);
						if (isRecurring)
						{
							container.addClass(EngageENDonationForm.options.recurClass);
						}
						else
						{
							container.addClass(EngageENDonationForm.options.oneTimeClass);
						}
						if (donRowBreak > 0)
						{
							theseCells = theseCells.add(container);
							if ((index + 1) % donRowBreak === 0 && (index + 1) >= donRowBreak)
							{
								theseCells.wrapAll(donRow.clone());
								theseCells = theseCells.slice(0, 0);
							}
						}
					}
				});
				if (typeof theseCells !== 'undefined' && theseCells.length > 0)
				{
					theseCells.wrapAll(donRow.clone());
				}
				if (EngageENDonationForm.document.find('.en__error').length === 0 && EngageENDonationForm.recurRadio.is(':checked'))
				{
					if (console)
					{
						console.log('Initializing: Monthly Checked On First Page Load\n' +
							'".en__error".length = ' + EngageENDonationForm.document.find('.en__error').length + '\n' +
							'.recurRadio:checked = ' + EngageENDonationForm.recurRadio.is(':checked') + '\n' +
							'.recurDefaultLevel = ' + EngageENDonationForm.options.recurDefaultLevel + '\n');
					}
					EngageENDonationForm.setDonLevel(EngageENDonationForm.options.recurDefaultLevel, true);
				}
				if (EngageENDonationForm.options.placeHoldersFor.length > 0)
				{
					if (console)
					{
						console.log('EngageENDonationForm: Adding placeholder text.');
					}
					if (EngageENDonationForm.options.placeHoldersFor.includes('text'))
					{
						EngageENDonationForm.fields.filter('[type="text"]').each(function ()
						{
							var thisField = jQuery(this),
								thisLabel = EngageENDonationForm.form.find('label[for="' + thisField.attr('id') + '"]').text();
							thisField.attr('placeholder', thisLabel);
						});
						for (var placeHolderOverridesKey in EngageENDonationForm.options.placeHolderOverrides)
						{
							EngageENDonationForm.fields.filter('[type="text"]').filter(placeHolderOverridesKey).attr('placeholder', EngageENDonationForm.options.placeHolderOverrides[placeHolderOverridesKey]);
						}
					}
					if (EngageENDonationForm.options.placeHoldersFor.includes('select'))
					{
						EngageENDonationForm.fields.filter('select').each(function ()
						{
							var thisField = jQuery(this),
								thisLabel = jQuery('label[for="' + thisField.attr('id') + '"]').text(),
								blankOption = thisField.find('option[value=""]');
							if (blankOption.length === 0)
							{
								blankOption = jQuery('<option value=""></option>');
								thisField.prepend(blankOption).val('');
							}
							if (EngageENDonationForm.options.hasOwnProperty('placeHolderOverrides'))
							{
								for (var placeholderKey in EngageENDonationForm.options.placeHolderOverrides)
								{
									if (thisField.is(placeholderKey))
									{
										thisLabel = EngageENDonationForm.options.placeHolderOverrides[placeholderKey];
									}
								}
							}
							blankOption.text(thisLabel);
						});
					}
					if (EngageENDonationForm.options.placeHoldersFor.includes('textarea'))
					{
						EngageENDonationForm.fields.filter('textarea').each(function ()
						{
							var thisField = jQuery(this),
								thisLabel = jQuery('label[for="' + thisField.attr('id') + '"]').text();
							if (EngageENDonationForm.options.hasOwnProperty('placeHolderOverrides'))
							{
								for (var placeholderKey in EngageENDonationForm.options.placeHolderOverrides)
								{
									if (thisField.is(placeholderKey))
									{
										thisLabel = EngageENDonationForm.options.placeHolderOverrides[placeholderKey];
									}
								}
							}
							if (thisLabel !== '')
							{
								thisField.attr('data-placeholder', thisLabel).bind('change blur', function ()
								{
									var textareaField = jQuery(this);
									if (textareaField.val() === '')
									{
										textareaField.val(textareaField.attr('data-placeholder'));
									}
								}).focus(function ()
								{
									var textareaField = jQuery(this);
									if (textareaField.val() === textareaField.attr('data-placeholder'))
									{
										textareaField.val('');
									}
								}).change();
							}
						});
					}
					EngageENDonationForm.otherLevel.input.prop('placeholder', EngageENDonationForm.options.placeHolderOverrides['other']);
				}
				else
				{
					if (console)
					{
						console.log('EngageENDonationForm: Placeholders not defined');
					}
				}
				if (EngageENDonationForm.options.currentPageNumber > 0)
				{
					EngageENDonationForm.goPage = function (page, runValidation)
					{
						var validate = true;
						if (typeof runValidation !== 'undefined')
						{
							validate = runValidation;
						}
						if (page > EngageENDonationForm.options.lastPageNumber)
						{
							return;
						}
						if (page > EngageENDonationForm.options.currentPageNumber && validate)
						{
							if (!EngageENDonationForm.parsley.validate(
								{
									group: EngageENDonationForm.options.pageIDPrefix + EngageENDonationForm.options.currentPageNumber
								}))
							{
								return;
							}
						}
						if (EngageENDonationForm.currentPageObject.find('.en__field__error').length > 0)
						{
							return;
						}
						if (EngageENDonationForm.options.pageCallbacks.hasOwnProperty(EngageENDonationForm.options.currentPageNumber) && EngageENDonationForm.options.pageCallbacks[EngageENDonationForm.options.currentPageNumber].hasOwnProperty('beforeHide'))
						{
							if (!EngageENDonationForm.options.pageCallbacks[EngageENDonationForm.options.currentPageNumber].beforeHide(EngageENDonationForm.options.currentPageNumber, EngageENDonationForm.currentPageObject))
							{
								return;
							}
						}
						if (EngageENDonationForm.options.pageCallbacks.hasOwnProperty(page) && EngageENDonationForm.options.pageCallbacks[page].hasOwnProperty('beforeShow'))
						{
							if (!EngageENDonationForm.options.pageCallbacks[page].beforeShow(page, EngageENDonationForm.body.find('section.' + EngageENDonationForm.options.pageIDPrefix + page)))
							{
								EngageENDonationForm.goPage(EngageENDonationForm.options.currentPageNumber + 1, false);
								return false;
							}
						}
						EngageENDonationForm.options.currentPageNumber = +page;
						EngageENDonationForm.body.removeClass('step1 step2 step3 step4 step5 step6 step7 step8').addClass('step' + EngageENDonationForm.options.currentPageNumber);
						EngageENDonationForm.currentPageObject = EngageENDonationForm.body.find('section.' + EngageENDonationForm.options.pageIDPrefix + EngageENDonationForm.options.currentPageNumber);
						EngageENDonationForm.currentPageObject.find('.en__field__error').remove();
						EngageENDonationForm.options.breadcrumbs.find('[data-step]').each(function ()
						{
							var thisCrumb = jQuery(this);
							thisCrumb.removeClass('current past');
							if (+thisCrumb.attr('data-step') < EngageENDonationForm.options.currentPageNumber)
							{
								thisCrumb.addClass('past');
							}
							else if (+thisCrumb.attr('data-step') === EngageENDonationForm.options.currentPageNumber)
							{
								thisCrumb.addClass('current').attr('data-visited', 'true');
							}
						});
						if (EngageENDonationForm.options.windowSizes.isMobile)
						{
							if (EngageENDonationForm.options.breadcrumbs.length > 0)
							{
								jQuery("html, body").animate(
								{
									scrollTop: EngageENDonationForm.options.breadcrumbs.offset().top
								}, 500);
							}
							else
							{
								jQuery("html, body").animate(
								{
									scrollTop: 0
								}, 500);
							}
						}
					};
					EngageENDonationForm.nextPage = function (event)
					{
						if (console)
						{
							console.log('nextPage\n' +
								'event.currentTarget.id = ' + event.currentTarget.id + '\n');
						}
						if (EngageENDonationForm.options.currentPageNumber < EngageENDonationForm.options.lastPageNumber)
						{
							EngageENDonationForm.options.newPageNumber = EngageENDonationForm.options.currentPageNumber + 1;
						}
					};
					EngageENDonationForm.previousPage = function (event)
					{
						if (console)
						{
							console.log('previousPage\n' +
								'event.currentTarget.id = ' + event.currentTarget.id + '\n');
						}
						event.preventDefault();
						event.stopImmediatePropagation();
						if (EngageENDonationForm.options.currentPageNumber > 1)
						{
							EngageENDonationForm.goPage(EngageENDonationForm.options.currentPageNumber - 1);
						}
					};
					EngageENDonationForm.options.lastPageNumber = jQuery(EngageENDonationForm.options.pageStartSelector).each(function (index)
					{
						var thisItem = jQuery(this),
							container = thisItem.closest(EngageENDonationForm.options.pageItemParentSelector),
							thisPage = jQuery('<section/>').addClass(EngageENDonationForm.options.pageItemClass).addClass(EngageENDonationForm.options.pageIDPrefix + (index + 1)).insertBefore(container);
						container.nextUntil(EngageENDonationForm.options.pageItemParentSelector +
							':has(' +
							EngageENDonationForm.options.pageStartSelector +
							'), ' +
							EngageENDonationForm.options.pageItemParentSelector +
							':has(' +
							EngageENDonationForm.options.pageExcludeSelector +
							')').addBack().appendTo(thisPage);
						if (EngageENDonationForm.options.useParsley)
						{
							thisPage.find('input').add('select').add('textarea').attr('data-parsley-group', EngageENDonationForm.options.pageIDPrefix + (index + 1));
						}
						if (EngageENDonationForm.options.breadcrumbs.length > 0)
						{
							var thisCrumb, thisTitle;
							if (EngageENDonationForm.options.windowSizes.isMobile && EngageENDonationForm.options.breadcrumbItemMobile.length > 0)
							{
								thisCrumb = EngageENDonationForm.options.breadcrumbItemMobile.clone();
							}
							else if (EngageENDonationForm.options.windowSizes.isTablet && EngageENDonationForm.options.breadcrumbItemTablet.length > 0)
							{
								thisCrumb = EngageENDonationForm.options.breadcrumbItemTablet.clone();
							}
							else if (EngageENDonationForm.options.windowSizes.isDesktop && EngageENDonationForm.options.breadcrumbItemDesktop.length > 0)
							{
								thisCrumb = EngageENDonationForm.options.breadcrumbItemDesktop.clone();
							}
							if (thisItem.attr('data-breadcrumb') !== undefined)
							{
								thisTitle = thisItem.attr('data-breadcrumb');
							}
							else
							{
								thisTitle = thisItem.html();
							}
							thisCrumb.find('.previous').click(function (event)
							{
								event.preventDefault();
								EngageENDonationForm.previousPage(event);
							});
							thisCrumb
							thisCrumb.find('.next').click(function (event)
							{
								EngageENDonationForm.nextPage(event);
							});
							thisCrumb.attr('data-step', index + 1).click(function (event)
							{
								event.preventDefault();
								var thisStep = jQuery(this);
								if (thisStep.attr('data-visited') === 'true')
								{
									EngageENDonationForm.goPage(+thisStep.attr('data-step'));
								}
							});
							var titleItem = thisCrumb;
							if (!thisCrumb.is('.title'))
							{
								titleItem = thisCrumb.find('.title');
							}
							titleItem.html(thisTitle);
							if (index === 0 && EngageENDonationForm.options.showLevel.length > 0)
							{
								thisCrumb.append(EngageENDonationForm.options.showLevel);
							}
							EngageENDonationForm.options.breadcrumbs.append(thisCrumb);
						}
						if (EngageENDonationForm.options.pageButtons.length > 0)
						{
							if (index === 0)
							{
								thisPage.append(EngageENDonationForm.options.pageButtons.clone().append(EngageENDonationForm.options.pageButtonColumn.clone()).append(EngageENDonationForm.options.continueButton.clone().wrap(EngageENDonationForm.options.pageButtonColumn.clone()).click(function (event)
								{
									EngageENDonationForm.nextPage(event);
								})));
							}
							else if (thisPage.find('.en__submit').length > 0)
							{
								thisPage.append(EngageENDonationForm.options.pageButtons.clone().append(thisPage.find('.en__submit')).append(EngageENDonationForm.options.backButton.clone().wrap(EngageENDonationForm.options.pageButtonColumn.clone()).click(function (event)
								{
									event.preventDefault();
									EngageENDonationForm.previousPage(event);
								})));
							}
							else
							{
								thisPage.append(EngageENDonationForm.options.pageButtons.clone().append(EngageENDonationForm.options.continueButton.clone().wrap(EngageENDonationForm.options.pageButtonColumn.clone()).click(function (event)
								{
									EngageENDonationForm.nextPage(event);
								})).append(EngageENDonationForm.options.backButton.clone().wrap(EngageENDonationForm.options.pageButtonColumn.clone()).click(function (event)
								{
									event.preventDefault();
									EngageENDonationForm.previousPage(event);
								})));
							}
						}
					}).length;
					jQuery('.' + EngageENDonationForm.options.pageItemClass).wrapAll(EngageENDonationForm.options.pageBlock.attr('id', 'pages'));
					if (EngageENDonationForm.options.breadcrumbs.length > 0)
					{
						EngageENDonationForm.document.find('#pages').prepend(EngageENDonationForm.options.breadcrumbs.attr('id', 'breadcrumbs'));
					}
				}
				else
				{
					if (console)
					{
						console.log('EngageENDonationForm: Multi-page structure not loaded.');
					}
					EngageENDonationForm.goPage = function ()
					{
						if (console)
						{
							console.log('goPage: Multi-page structure not loaded.');
						}
						return true;
					};
					EngageENDonationForm.nextPage = function ()
					{
						if (console)
						{
							console.log('nextPage: Multi-page structure not loaded.');
						}
						return false;
					};
					EngageENDonationForm.previousPage = function ()
					{
						if (console)
						{
							console.log('previousPage: Multi-page structure not loaded.');
						}
						return false;
					};
				}
				if (EngageENDonationForm.options.useParsley)
				{
					if (console)
					{
						console.log('EngageENDonationForm: Parsley validator found.');
					}
					EngageENDonationForm.setParsley = function ()
					{
						var thisInput = jQuery(this),
							thisID = thisInput.attr('id');
						if (!EngageENDonationForm.options.excludeParsley.includes(thisID) || thisInput.attr('type') !== 'hidden')
						{
							thisInput.attr('data-parsley-required', 'true').attr('data-parsley-errors-container', '#' + thisID + '-errors');
							if (jQuery(thisID + '-errors').length === 0)
							{
								thisInput.before('<div id="' + thisID + '-errors" class="parsley-errors-list"></div>');
							}
						}
					};
					EngageENDonationForm.loadParsleyValidators = function ()
					{
						if (EngageENDonationForm.options.useParsley)
						{
							if (EngageENDonationForm.options.useCreditCardValidator)
							{
								EngageENDonationForm.cardTypeSelect = function (result)
								{
									if (console)
									{
										console.log('cardTypeSelect');
										for (var key in result)
										{
											if (result.hasOwnProperty(key))
											{
												var value = result[key];
												console.log('  ' + key + ' = ' + value);
												for (var key2 in value)
												{
													if (value.hasOwnProperty(key2))
													{
														var value2 = value[key2];
														console.log('    ' + key2 + ' = ' + value2);
													}
												}
											}
										}
									}
									if (result.valid)
									{
										EngageENDonationForm.fields.filter('[name="transaction.paymenttype"][value="' +
											EngageENDonationForm.options.translateCardTypes[result.card_type.name] +
											'"]').click();
									}
									else
									{
										EngageENDonationForm.fields.filter('[name="transaction.paymenttype"]').prop('checked', false);
									}
									return result.valid;
								};
								window.Parsley.addValidator('creditcard',
								{
									validateString: function (value, requirement, parsleyInstance)
									{
										var result = {};
										if (result)
										{
											if (console)
											{
												console.log('creditcard validator\n' +
													'value = ' + value + '\n' +
													'requirement = ' + requirement + '\n' +
													'parsleyInstance = ' + parsleyInstance + '\n');
											}
											if (EngageENDonationForm.options.useCardTypeSelect)
											{
												result = jQuery(parsleyInstance.element).validateCreditCard(EngageENDonationForm.cardTypeSelect);
											}
											else
											{
												result = jQuery(parsleyInstance.element).validateCreditCard();
											}
											return result.valid;
										}
										return false;
									},
									messages:
									{
										en: 'The card number is invalid.'
									}
								});
								EngageENDonationForm.fields.filter('#en__field_transaction_ccnumber').attr('data-parsley-creditcard', 'required').attr('data-parsley-errors-container', '#en__field_transaction_ccnumber-errors');
								EngageENDonationForm.document.find('.en__field--ccnumber > label').attr('id', 'en__field_transaction_ccnumber-errors').addClass('parsley-errors-list');
								if (EngageENDonationForm.options.useCardTypeSelect)
								{
									EngageENDonationForm.fields.filter('#en__field_transaction_ccnumber').validateCreditCard(EngageENDonationForm.cardTypeSelect, EngageENDonationForm.options.acceptCardTypes);
								}
							}
							window.Parsley.addValidator('expiration',
							{
								validateString: function ()
								{
									var cardExpMoField = EngageENDonationForm.fields.filter('[name="transaction.ccexpire"]#en__field_transaction_ccexpire');
									if (cardExpMoField.is(':visible'))
									{
										var cardExpMo = cardExpMoField.val(),
											cardExpYr = EngageENDonationForm.fields.filter('[name="transaction.ccexpire"]:not(#en__field_transaction_ccexpire)').val();
										if (cardExpMo !== '' && cardExpYr !== '')
										{
											var selectDate = new Date(cardExpYr, cardExpMo),
												nextMonth = selectDate.setMonth(selectDate.getMonth() + 1),
												expireDate = new Date(nextMonth - 1),
												now = new Date(),
												returnVal = (now <= expireDate);
											if (returnVal)
											{
												EngageENDonationForm.document.find('.en__field--ccexpire').removeClass('error');
												return true;
											}
											else
											{
												EngageENDonationForm.document.find('.en__field--ccexpire').addClass('error');
												return false;
											}
										}
										else
										{
											return true;
										}
									}
								},
								messages:
								{
									en: 'Please select a valid expiration date.'
								}
							});
							EngageENDonationForm.fields.filter('[name="transaction.ccexpire"]#en__field_transaction_ccexpire').attr('data-parsley-expiration', '').attr('data-parsley-errors-container', '#en__field_transaction_ccexpire-errors');
							EngageENDonationForm.fields.filter('[name="transaction.ccexpire"]:not(#en__field_transaction_ccexpire)').attr('data-parsley-expiration', '').attr('data-parsley-errors-container', '#en__field_transaction_ccexpire-errors');
							EngageENDonationForm.document.find('label[for="en__field_transaction_ccexpire"]').before('<div id="en__field_transaction_ccexpire-errors" class="parsley-errors-list"></div>');
							window.Parsley.addValidator('otherlevel',
							{
								validateString: function (value, requirement)
								{
									if (EngageENDonationForm.otherLevel.radio.prop('checked'))
									{
										return EngageENDonationForm.otherLevel.input.get() >= +requirement;
									}
									else
									{
										return true;
									}
								},
								messages:
								{
									en: 'This value should be greater than or equal to ' + EngageENDonationForm.options.otherMinimum + '.'
								}
							});
							EngageENDonationForm.otherLevel.input.attr('data-parsley-otherlevel', EngageENDonationForm.options.otherMinimum).attr('data-parsley-errors-container', '#' +
								EngageENDonationForm.otherLevel.radio.attr('id') +
								'-errors');
							EngageENDonationForm.otherLevel.radio.parents('.en__field__item').before('<div id="' +
								EngageENDonationForm.otherLevel.radio.attr('id') +
								'-errors" class="parsley-errors-list"></div>');
							window.Parsley.addValidator('textarea',
							{
								validateString: function (value, requirement, parsleyInstance)
								{
									if (typeof jQuery(parsleyInstance.element).attr('data-parsley-textarea-required') !== 'undefined' && jQuery(parsleyInstance.element).attr('data-parsley-textarea-required').toString().toLowerCase() === 'true')
									{
										return !(value === requirement);
									}
									else
									{
										return true;
									}
								},
								messages:
								{
									en: 'this is required.'
								}
							});
						}
					};
					EngageENDonationForm.setParsleyRequired = function (jQObject, isRequired)
					{
						jQObject.each(function ()
						{
							var thisInput = jQuery(this),
								thisID = thisInput.attr('id');
							if (!EngageENDonationForm.options.excludeParsley.includes(thisID) || thisInput.attr('type') !== 'hidden')
							{
								thisInput.attr('data-parsley-required', isRequired);
							}
						});
					};
					var fieldRequired = jQuery('span.field-required');
					fieldRequired.siblings('input[type="text"]:not([id^="level"])').each(EngageENDonationForm.setParsley);
					fieldRequired.siblings('select').each(EngageENDonationForm.setParsley);
					if (!EngageENDonationForm.options.placeHoldersFor.includes('textarea'))
					{
						fieldRequired.siblings('textarea').each(EngageENDonationForm.setParsley);
					}
					EngageENDonationForm.parsley = EngageENDonationForm.form.parsley();
					EngageENDonationForm.form.off('submit.Parsley');
					EngageENDonationForm.loadParsleyValidators();
				}
				else
				{
					if (console)
					{
						console.log('EngageENDonationForm: Parsley validator not found.');
					}
					EngageENDonationForm.parsley = {
						validate: function ()
						{
							if (console)
							{
								console.log('Parsley.validate: Parsley is not loaded.');
							}
							return true;
						}
					};
					EngageENDonationForm.setParsley = function ()
					{
						if (console)
						{
							console.log('setParsley: Parsley is not loaded.');
						}
						return false;
					};
					EngageENDonationForm.loadParsleyValidators = function ()
					{
						if (console)
						{
							console.log('loadParsleyValidators: Parsley is not loaded.');
						}
						return false;
					};
					EngageENDonationForm.setParsleyRequired = function ()
					{
						if (console)
						{
							console.log('setParsleyRequired: Parsley is not loaded.');
						}
						return false;
					};
				}
				EngageENDonationForm.payTypeSwitchShow = jQuery.extend(
				{
					frequencies: ['MONTHLY'],
					selector: '.en__field--ach-eft-selection input[type="radio"]'
				}, EngageENDonationForm.options.payTypeSwitchShow);
				EngageENDonationForm.payTypeSwitchTypes = jQuery.extend(
				{
					'ACH':
					{
						frequencies: ['MONTHLY'],
						selector: '#exampleCheck'
					},
					'CC':
					{
						frequencies: ['ONE-TIME', 'MONTHLY', 'ANNUAL'],
						selector: ''
					},
					'PP':
					{
						frequencies: ['ONE-TIME', 'MONTHLY', 'ANNUAL'],
						selector: ''
					},
					'AP':
					{
						frequencies: ['ONE-TIME', 'MONTHLY', 'ANNUAL'],
						selector: ''
					},
					'GP':
					{
						frequencies: ['ONE-TIME', 'MONTHLY', 'ANNUAL'],
						selector: ''
					}
				}, EngageENDonationForm.options.payTypeSwitchTypes);
				EngageENDonationForm.payTypeSwitch = jQuery(EngageENDonationForm.options.payTypeSwitchShow.selector);
				if (EngageENDonationForm.payTypeSwitch.length > 0)
				{
					EngageENDonationForm.payTypeSwitch.change(function ()
					{
						var frequency = EngageENDonationForm.calcDonation()[EngageENDonationForm.CD_FREQUENCY],
							payTypeSwitch = jQuery(this);
						if (payTypeSwitch.filter(':checked').val() === 'ACH')
						{
							EngageENDonationForm.fields.filter('[name="transaction.paymenttype"][value="ACH"]').prop('checked', true);
						}
						for (var payTypeKey in EngageENDonationForm.options.payTypeSwitchTypes)
						{
							if (EngageENDonationForm.options.payTypeSwitchTypes.hasOwnProperty(payTypeKey))
							{
								for (var payTypesSelKey in EngageENDonationForm.options.payTypeSwitchTypes[payTypeKey])
								{
									if (EngageENDonationForm.options.payTypeSwitchTypes[payTypeKey].hasOwnProperty(payTypesSelKey))
									{
										EngageENDonationForm.document.find(EngageENDonationForm.options.payTypeSwitchTypes[payTypeKey][payTypesSelKey]).hide();
									}
								}
							}
						}
						var thisPayTypeValue = payTypeSwitch.filter(':checked').val();
						if (EngageENDonationForm.options.payTypeSwitchTypes.hasOwnProperty(thisPayTypeValue))
						{
							for (var payTypeValueKey in EngageENDonationForm.options.payTypeSwitchTypes[thisPayTypeValue])
							{
								if (EngageENDonationForm.options.payTypeSwitchTypes[thisPayTypeValue].hasOwnProperty(payTypeValueKey))
								{
									var objectSelector = EngageENDonationForm.options.payTypeSwitchTypes[thisPayTypeValue][payTypeValueKey];
									EngageENDonationForm.document.find(objectSelector).show();
								}
							}
						}
					});
					jQuery.extend(EngageENDonationForm.options.afterDonationCallbacks,
					{
						'00200_SwapPaymentTypes': function (event)
						{
							if (console)
							{
								console.log('00200_SwapPaymentTypes\n' +
									'event.currentTarget.id = ' + event.currentTarget.id + '\n');
							}
							if (EngageENDonationForm.options.payTypeSwitchShow.frequencies.includes(EngageENDonationForm.calcDonation()[EngageENDonationForm.CD_FREQUENCY]))
							{
								EngageENDonationForm.payTypeSwitch.parents('.en__field').show();
								if (event.currentTarget.id === EngageENDonationForm.recurRadio.prop('id'))
								{
									EngageENDonationForm.payTypeSwitch.filter('[value="ACH"]').click();
								}
							}
							else
							{
								EngageENDonationForm.payTypeSwitch.filter('[value="CC"]').click().parents('.en__field').hide();
							}
						}
					});
				}
				if (typeof EngageENDonationForm.goPage !== 'undefined')
				{
					EngageENDonationForm.currentPageObject = EngageENDonationForm.body.find('section.' + EngageENDonationForm.options.pageIDPrefix + EngageENDonationForm.options.currentPageNumber);
					EngageENDonationForm.goPage(EngageENDonationForm.options.currentPageNumber);
					jQuery('[data-step="1"]').attr('data-visited', 'true');
					if (EngageENDonationForm.showLevel.length > 0)
					{
						EngageENDonationForm.showLevel.set();
					}
				}
				EngageENDonationForm.options.afterLoad(EngageENDonationForm.options);
				EngageENDonationForm.finished = false;
				EngageENDonationForm.cardFeeAdded = false;
				EngageENDonationForm.form.show().submit(function (event)
				{
					if (console)
					{
						console.log('onSubmit\n' +
							'event.currentTarget.id = ' + event.currentTarget.id + '\n');
					}
					if (EngageENDonationForm.finished || EngageENDonationForm.options.currentPageNumber === 0)
					{
						if (!EngageENDonationForm.cardFeeAdded)
						{
							var thisDonation = EngageENDonationForm.calcDonation();
							if (thisDonation[EngageENDonationForm.CD_ISCARDFEE])
							{
								EngageENDonationForm.otherLevel.input.set(thisDonation[EngageENDonationForm.CD_AMOUNT] + thisDonation[EngageENDonationForm.CD_CARDFEEAMOUNT]);
							}
							EngageENDonationForm.cardFeeAdded = true;
						}
					}
					else
					{
						event.preventDefault();
						event.stopImmediatePropagation();
						setTimeout(function ()
						{
							if (console)
							{
								console.log('onSubmit setTimeout');
							}
							EngageENDonationForm.currentPageObject.siblings('section').removeClass(EngageENDonationForm.options.sectionErrorClass).find('.en__field__error').remove();
							if (EngageENDonationForm.currentPageObject.find('.en__field__error').length > 0)
							{
								EngageENDonationForm.currentPageObject.addClass(EngageENDonationForm.options.sectionErrorClass);
								EngageENDonationForm.form.addClass(EngageENDonationForm.options.formErrorClass);
							}
							else
							{
								EngageENDonationForm.form.removeClass(EngageENDonationForm.options.formErrorClass);
								if (EngageENDonationForm.options.currentPageNumber === EngageENDonationForm.options.lastPageNumber)
								{
									EngageENDonationForm.finished = true;
									EngageENDonationForm.form.submit();
								}
								else
								{
									EngageENDonationForm.goPage(EngageENDonationForm.options.newPageNumber);
								}
							}
						}, 50);
					}
				});
			}
			else
			{
				if (console)
				{
					console.log('EngageENDonationForm: No form found.');
				}
			}
		});
	}
	else
	{
		if (console)
		{
			console.log("EngageENDonationForm: Won't run in EN Page Builder");
		}
	}
}