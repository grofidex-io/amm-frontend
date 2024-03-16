describe('Remove Liquidity', () => {
  it('redirects from address-address to address/address', () => {
    cy.visit('/remove/0x6d7ce523d59C59De27BB755A1981f4043e79C70E-0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56')
    cy.url().should(
      'contain',
      '/remove/0x6d7ce523d59C59De27BB755A1981f4043e79C70E/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    )
  })

  it('bnb-cake remove', () => {
    cy.visit('/remove/BNB/0x6d7ce523d59C59De27BB755A1981f4043e79C70E')
    cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'BNB')
    cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'CAKE')
  })

  it('cake-bnb remove', () => {
    cy.visit('/remove/0x6d7ce523d59C59De27BB755A1981f4043e79C70E/BNB')
    cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'CAKE')
    cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'BNB')
  })

  it('loads the two correct tokens', () => {
    cy.visit('/remove/0x6d7ce523d59C59De27BB755A1981f4043e79C70E/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56')
    cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'CAKE')
    cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'BUSD')
  })

  it('does not crash if BNB is duplicated', () => {
    cy.visit('/remove/BNB/BNB')
    cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'BNB')
    cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'BNB')
  })

  it('does not crash if token is duplicated', () => {
    cy.visit('/remove/0x6d7ce523d59C59De27BB755A1981f4043e79C70E/0x6d7ce523d59C59De27BB755A1981f4043e79C70E')
    cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'CAKE')
    cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'CAKE')
  })

  it('token not in storage is loaded', () => {
    cy.visit('/remove/0xD74b782E05AA25c50e7330Af541d46E18f36661C/0x6d7ce523d59C59De27BB755A1981f4043e79C70E')
    cy.get('#remove-liquidity-tokena-symbol').should('contain.text', 'QUACK')
    cy.get('#remove-liquidity-tokenb-symbol').should('contain.text', 'CAKE')
  })
})
