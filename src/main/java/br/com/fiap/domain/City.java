package br.com.fiap.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A City.
 */
@Entity
@Table(name = "city")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class City implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "city_name", nullable = false)
    private String cityName;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "countryNames" }, allowSetters = true)
    private Country country;

    @OneToMany(mappedBy = "city")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "product", "city" }, allowSetters = true)
    private Set<ProductDaily> cityNames = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public City id(Long id) {
        this.id = id;
        return this;
    }

    public String getCityName() {
        return this.cityName;
    }

    public City cityName(String cityName) {
        this.cityName = cityName;
        return this;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }

    public Country getCountry() {
        return this.country;
    }

    public City country(Country country) {
        this.setCountry(country);
        return this;
    }

    public void setCountry(Country country) {
        this.country = country;
    }

    public Set<ProductDaily> getCityNames() {
        return this.cityNames;
    }

    public City cityNames(Set<ProductDaily> productDailies) {
        this.setCityNames(productDailies);
        return this;
    }

    public City addCityName(ProductDaily productDaily) {
        this.cityNames.add(productDaily);
        productDaily.setCity(this);
        return this;
    }

    public City removeCityName(ProductDaily productDaily) {
        this.cityNames.remove(productDaily);
        productDaily.setCity(null);
        return this;
    }

    public void setCityNames(Set<ProductDaily> productDailies) {
        if (this.cityNames != null) {
            this.cityNames.forEach(i -> i.setCity(null));
        }
        if (productDailies != null) {
            productDailies.forEach(i -> i.setCity(this));
        }
        this.cityNames = productDailies;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof City)) {
            return false;
        }
        return id != null && id.equals(((City) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "City{" +
            "id=" + getId() +
            ", cityName='" + getCityName() + "'" +
            "}";
    }
}
