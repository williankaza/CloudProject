package br.com.fiap.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.fiap.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProductDailyTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProductDaily.class);
        ProductDaily productDaily1 = new ProductDaily();
        productDaily1.setId(1L);
        ProductDaily productDaily2 = new ProductDaily();
        productDaily2.setId(productDaily1.getId());
        assertThat(productDaily1).isEqualTo(productDaily2);
        productDaily2.setId(2L);
        assertThat(productDaily1).isNotEqualTo(productDaily2);
        productDaily1.setId(null);
        assertThat(productDaily1).isNotEqualTo(productDaily2);
    }
}
