/* eslint-disable no-undef */

// --
// ADICIONA DESTAQUE A OPÇÃO ATIVA DO MENU
// --
const linksMenu = document.querySelectorAll('.default_menu .item_menu');

// eslint-disable-next-line no-restricted-globals
const currentPageURL = location.pathname;

Array.from(linksMenu).map(async item => {
  const targetURL = item.children[1].href;

  if (currentPageURL !== '/') {
    if (targetURL.indexOf(currentPageURL) !== -1) {
      // if (currentPageURL.indexOf(targetURL) !== -1) {
      item.classList.add('active');
    }
  } else if (item.classList.contains('home')) {
    item.classList.add('active');
  }
});

// --
// EXIBIÇÃO DO MENU MOBILE
// --

const toggleMenu = document.querySelectorAll('.toggle_menu');
const menuMobile = document.querySelector('.mob_menu');
const overlay = document.querySelector('.menu_overlay');
const btnMobMenu = document.querySelector('.btn_mob_menu .material-icons');

// Abrindo e fechando o Menu Mobile
for (let m = 0; m < toggleMenu.length; m += 1) {
  toggleMenu[m].addEventListener('click', () => {
    overlay.classList.toggle('menu_overlay_is_open');
    menuMobile.classList.toggle('btn_mob_menu_is_closed');
    menuMobile.classList.toggle('btn_mob_menu_is_open');

    const icon = btnMobMenu.innerHTML;

    if (icon === 'menu') {
      btnMobMenu.innerHTML = 'close';
    } else {
      btnMobMenu.innerHTML = 'menu';
    }
  });
}

// --
// TROCA TIPO DE CAMPO DE PESQUISA AO CLICAR NO RADIO BUTTON
// --
const SelectSearch = {
  apply(input, func) {
    setTimeout(() => {
      // eslint-disable-next-line no-param-reassign
      input = SelectSearch[func](input);
    }, 1);
  },
  radioType(input) {
    const SearchName = document.querySelector('.SearchName');
    const SearchPhone = document.querySelector('.SearchPhone');

    const radioName = document.querySelector('input[name=searchName]');
    const radioPhone = document.querySelector('input[name=searchPhone]');

    if (input.value === 'name') {
      SearchName.classList.add('visible');
      SearchName.classList.remove('invisible');
      SearchPhone.classList.add('invisible');
      radioName.removeAttribute('disabled', 'disabled');
      radioPhone.setAttribute('disabled', 'disabled');
    }
    if (input.value === 'phone') {
      SearchPhone.classList.add('visible');
      SearchPhone.classList.remove('invisible');
      SearchName.classList.add('invisible');
      radioPhone.removeAttribute('disabled', 'disabled');
      radioName.setAttribute('disabled', 'disabled');
    }
  },
};

// --
// VALIDAÇÃO PERSONALIZADA ATRAVÉS DO REQUIRED DO HTML 5
// --

const fields = document.querySelectorAll('[required]');

// PERSONALISA MENSAGEM DE VALIDAÇÃO NATIVA DO HTML5
function ValidateField(field) {
  // logica para verificar se existem erros
  function verifyErrors() {
    let foundError = false;

    // eslint-disable-next-line no-restricted-syntax
    for (const error in field.validity) {
      if (field.validity[error] && !field.validity.valid) {
        foundError = error;
      }
    }

    return foundError;
  }

  function customMessage(typeError) {
    const messages = {
      text: {
        valueMissing: 'Por favor, preencha este campo',
      },
      email: {
        valueMissing: 'E-mail é obrigatório',
        typeMismatch: 'Por favor, preencha um e-mail válido',
        patternMismatch: 'Por favor, preencha um e-mail válido',
      },
      password: {
        valueMissing: 'Senha é obrigatória',
      },
      'select-one': {
        valueMissing: 'Selecione um item da lista',
      },
      tel: {
        valueMissing: 'Telefone é obrigatório',
        patternMismatch: 'Por favor, preencha um telefone válido',
      },
      date: {
        valueMissing: 'Data é obrigatória',
        patternMismatch: 'Por favor, preencha uma data válida',
        badInput: 'Digite uma data válida',
      },
      number: {
        valueMissing: 'Este campo é obrigatório',
        rangeOverflow: 'Digite um número válido',
      },
      // Adicionar mensagem de tratamneto para cada tipo de campo do formulário
    };

    return messages[field.type][typeError];
  }

  function setCustomMessage(message) {
    const spanError = field.parentNode.querySelector('span.error');

    if (message) {
      spanError.classList.add('active');
      spanError.innerHTML = message;
    } else {
      spanError.classList.remove('active');
      spanError.innerHTML = '';
    }
  }

  // eslint-disable-next-line func-names
  return function () {
    const error = verifyErrors();

    if (error) {
      const message = customMessage(error);

      // eslint-disable-next-line no-param-reassign
      // field.style.borderColor = 'red';
      setCustomMessage(message);
    } else {
      // eslint-disable-next-line no-param-reassign
      // field.style.borderColor = 'green';
      setCustomMessage('');
    }
  };
}
function customValidation(event) {
  const field = event.target;

  const validation = ValidateField(field);

  validation();
}

// EXIBE MENSAGENS DE VALIDAÇÃO NATIVA DO HTML5
// FAZ A VERIFICAÇÃO PELO EVENTO INVALID
// eslint-disable-next-line no-restricted-syntax
for (const field of fields) {
  field.addEventListener('invalid', event => {
    // eliminar bubble
    event.preventDefault();

    customValidation(event);
  });
  field.addEventListener('blur', customValidation);
}

// EXIBE MENSAGENS DE VALIDAÇÃO NATIVA DO HTML5
// FAZ A VERIFICAÇÃO PELO EVENTO ONINPUT
// eslint-disable-next-line no-restricted-syntax
for (const field of fields) {
  field.addEventListener('input', event => {
    // eliminar bubble
    event.preventDefault();

    customValidation(event);
  });
  field.addEventListener('blur', customValidation);
}

// --
// COMPARAÇÃO DE SENHAS
// --

// eslint-disable-next-line consistent-return
function comparePassword() {
  const fieldsPasswords = document.querySelectorAll('[type="password"]');
  if (fieldsPasswords.length === 2) {
    if (fieldsPasswords[0].value !== fieldsPasswords[1].value) {
      Array.from(fieldsPasswords).map(async item => {
        const spanError = item.parentNode.querySelector('span.error_repeat');
        spanError.classList.add('active2');
        // spanError.classList.remove('active');
        spanError.innerHTML = 'As senhas não conferem';
      });

      return false;
    }
    Array.from(fieldsPasswords).map(async item => {
      const spanError = item.parentNode.querySelector('span.error_repeat');
      spanError.classList.remove('active2');
      spanError.classList.remove('active');
      spanError.innerHTML = '';
    });
  }
}

// VERIFICA IGUALDADE DE SENHAS ATRAVÉS DO SUBMIT DO FORM
// eslint-disable-next-line no-unused-vars
function validateForm() {
  const verifyPassword = comparePassword();

  return verifyPassword;
}

// EXECUTA DIVERSAS FUNÇÕES RELACIONADAS A VALIDAÇÃO DE FORMULÁRIOS
const Validate = {
  apply(input, func) {
    // Validate.clearErrors(input);

    Validate[func](input);
  },
  // eslint-disable-next-line consistent-return
  verifyPasswordRepeat() {
    comparePassword();
  },
};

// --
// APLICA MÁSCARAS EM CAMPOS DOS FORMULÁRIOS
// --

const Mask = {
  apply(input, func) {
    setTimeout(() => {
      // eslint-disable-next-line no-param-reassign
      input.value = Mask[func](input.value);
    }, 1);
  },
  formatBRL(value) {
    // eslint-disable-next-line no-param-reassign
    value = value.replace(/\D/g, '');

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100);
  },
  phone(value) {
    let phone = value.replace(/\D/g, '');

    if (phone.length > 11) phone = phone.slice(0, -1);

    phone = phone.replace(/(\d{2})(\d)/, '($1) $2');
    phone = phone.replace(/(\d{5})(\d)/, '$1-$2');

    return phone;
  },
};

// --
// ESTRUTURA DE PAGINAÇÃO
// --
function paginate(selectedPage, totalPages) {
  const pages = [];
  let oldPage;

  for (let currentPage = 1; currentPage <= totalPages; currentPage += 1) {
    const firstAndLastPage = currentPage === 1 || currentPage === totalPages;
    const pagesAfterSelectedPage = currentPage <= selectedPage + 2;
    const pagesBeforeSelectedPage = currentPage >= selectedPage - 2;

    if (
      firstAndLastPage ||
      (pagesBeforeSelectedPage && pagesAfterSelectedPage)
    ) {
      if (oldPage && currentPage - oldPage > 2) {
        pages.push('...');
      }

      if (oldPage && currentPage - oldPage === 2) {
        pages.push(oldPage + 1);
      }

      pages.push(currentPage);

      oldPage = currentPage;
    }
  }

  return pages;
}

function createPagination(pagination) {
  const { filter } = pagination.dataset;
  const { name } = pagination.dataset;
  const { phone } = pagination.dataset;
  const pageDataSet = +pagination.dataset.page;
  const totalDataSet = +pagination.dataset.total;
  const pages = paginate(pageDataSet, totalDataSet);

  let elements = '';

  // eslint-disable-next-line no-restricted-syntax
  for (const page of pages) {
    if (String(page).includes('...')) {
      elements += `<span>${page}</span>`;
    } else if (page === pageDataSet) {
      elements += `<span class="current">${page}</span>`;
    } else if (name) {
      elements += `<a href="?page=${page}&searchName=${name}&selectFieldSearch=name">${page}</a>`;
    } else if (phone) {
      elements += `<a href="?page=${page}&searchPhone=${phone}&selectFieldSearch=phone">${page}</a>`;
    } else {
      elements += `<a class="item" href="?page=${page}&filter=${filter}">${page}</a>`;
    }
  }

  // eslint-disable-next-line no-param-reassign
  pagination.innerHTML = elements;
}

const pagination = document.querySelector('.pagination');

if (pagination) {
  createPagination(pagination);
}

// --
// SELECIONA OS NÚMEROS DA APOSTAS
// --

// Cria números de 0 a 80 automaticamente
function createNumbersBet(betsNumbers) {
  let elements = '';

  for (let number = 1; number <= 80; number += 1) {
    elements += `<div class="item">
                    <button class="notSelected"
                      value="${number}"
                      onclick="ValidateBets.apply(event, 'selectNumber')"
                    >
                      ${number}
                    </button>
                </div>`;
  }

  // eslint-disable-next-line no-param-reassign
  betsNumbers.innerHTML = elements;
}

const betsNumbers = document.querySelector('.bets_numbers');

if (betsNumbers) {
  createNumbersBet(betsNumbers);
}

const ValidateBets = {
  numbersLimit: 10,
  clickedButton: null,
  betsFields: document.querySelector('.bets_fields'),
  apply(event, func) {
    setTimeout(() => {
      // eslint-disable-next-line no-param-reassign
      input = ValidateBets[func](event);
    }, 1);
  },
  selectNumber(event) {
    const button = event.target;
    const number = event.target.getAttribute('value');

    const qtdFields = document.querySelectorAll(
      'input[value][type="text"]:not([value=""])',
    );

    if (button.classList.contains('notSelected') && qtdFields.length < 10) {
      this.selected(button);
      ValidateBets.addNumber(number);
    } else if (button.classList.contains('selected')) {
      this.notSelected(button);
      ValidateBets.removeNumber(number);
    }
  },
  selected(input) {
    input.classList.add('selected');
    input.classList.remove('notSelected');
  },
  notSelected(input) {
    input.classList.add('notSelected');
    input.classList.remove('selected');
  },
  visible(input) {
    input.parentNode.classList.add('visible');
    input.parentNode.classList.remove('invisible');
  },
  invisible(input) {
    input.parentNode.classList.add('invisible');
    input.parentNode.classList.remove('visible');
  },
  addNumber(number) {
    // const { betsFields } = ValidateBets;
    const inputs = document.querySelectorAll('.input_number');

    // eslint-disable-next-line no-restricted-syntax
    for (let i = 0; i <= inputs.length; i += 1) {
      if (i < ValidateBets.numbersLimit) {
        if (inputs[i].value === '') {
          this.visible(inputs[i]);
          inputs[i].setAttribute('value', number);

          break;
        }
      } else {
        console.log('VocÊ atingiu o numero máximo de números add');
      }
    }
  },
  removeNumber(number) {
    // const { betsFields } = ValidateBets;
    const inputs = document.querySelectorAll('.input_number');

    // eslint-disable-next-line no-restricted-syntax
    for (let i = 0; i <= inputs.length; i += 1) {
      if (i < ValidateBets.numbersLimit) {
        if (inputs[i].value === number) {
          this.invisible(inputs[i]);
          inputs[i].removeAttribute('value', number);

          break;
        }
      } else {
        console.log('VocÊ atingiu o numero máximo de números remove');
      }
    }
  },
};
